using System.Data;
using Backend.Errors;
using Backend.Models.General;
using Backend.Models.Projects;
using Backend.Models.Users;
using Backend.Utility;
using Dapper;
using Task = Backend.Models.Tasks.Task;

namespace Backend.Core.Services.Projects;

/// <summary>
/// A service used to manage <see cref="Project"/> entities in the database.
/// </summary>
public interface IProjectService
{
    /// <summary>
    /// Check whether or not a <see cref="Project"/> by the given <see cref="Guid"/> exists.
    /// </summary>
    /// <param name="id">The guid of the <see cref="Project"/> which should be checked.</param>
    /// <returns>Whether or not the <see cref="Project"/> exists.</returns>
    bool Exists(Guid id);
    
    /// <summary>
    /// Create a new <see cref="Project"/>.
    /// </summary>
    /// <param name="configuration">The configuration by which the <see cref="Project"/> should be created.</param>
    /// <returns>The <see cref="Guid"/> of the newly created <see cref="Project"/>.</returns>
    Guid Create(ProjectCreateConfiguration configuration);

    /// <summary>
    /// Retrieve a <see cref="Project"/> by the given <see cref="Guid"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="Project"/>.</param>
    /// <returns>The retrieved <see cref="Project"/>.</returns>
    Project Get(Guid id);
    
    /// <summary>
    /// Retrieve a <see cref="Project"/> by the given task <see cref="Guid"/>.
    /// </summary>
    /// <param name="task">The <see cref="Guid"/> of the <see cref="Task"/> under the <see cref="Project"/>.</param>
    /// <param name="category">The <see cref="Guid"/> of the <see cref="Category"/> under the <see cref="Project"/>.</param>
    /// <returns>The retrieved <see cref="Project"/>.</returns>
    Guid? Identify(Guid? task = null, Guid? category = null);
    
    /// <summary>
    /// Retrieve the range of <see cref="Project"/> objects linked to a user by the given user <see cref="Guid"/>.
    /// </summary>
    /// <param name="userId">The <see cref="Guid"/> of the <see cref="User"/>.</param>
    /// <returns>The retrieved range of <see cref="Project"/> objects linked to the user.</returns>
    List<Project> All(Guid userId);

    /// <summary>
    /// Update an existing <see cref="Project"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="Project"/> which should be updated.</param>
    /// <param name="configuration">The configuration by which the <see cref="Project"/> should be updated.</param>
    void Update(Guid id, ProjectUpdateConfiguration configuration);

    /// <summary>
    /// Delete an existing <see cref="Project"/> by the given <see cref="Guid"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="Project"/> which should be deleted.</param>
    void Delete(Guid id);
}

/// <inheritdoc cref="IProjectService"/>>
public class ProjectService : IProjectService
{
    /// <summary>
    /// The connection to the current database.
    /// </summary>
    private readonly IDbConnection _connection;
    
    /// <summary>
    /// Initialize the <see cref="Project"/> service.
    /// </summary>
    /// <param name="connection">The connection to the current database.</param>
    public ProjectService(IDbConnection connection)
    {
        _connection = connection;
    }
    
    /// <inheritdoc cref="IProjectService.Exists"/>>
    public bool Exists(Guid id)
        => _connection.ExecuteScalar<bool>(
            """SELECT count(DISTINCT 1) FROM "Project" p WHERE p.Id = @Id""", 
            new { id }
        );

    /// <inheritdoc cref="IProjectService.Create"/>>
    public Guid Create(ProjectCreateConfiguration configuration)
    {
        var id = _connection.QuerySingle<Guid>(
            """
            INSERT INTO "Project" (Name, Description, OwnerId)
            VALUES (@Name, @Description, @OwnerId)
            RETURNING Id
            """, new
            {
                configuration.Name, 
                configuration.Description,
                configuration.OwnerId
            }
        );

        _connection.Execute(
            """
            INSERT INTO "Member" (UserId, ProjectID)
            VALUES (@UserId, @ProjectId)
            """,
            new
            {
                UserId = configuration.OwnerId,
                ProjectId = id
            }
        );

        return id;
    }

    /// <inheritdoc cref="IProjectService.Get"/>>
    public Project Get(Guid id)
    {
        // Check if the item exists before attempting to retrieve
        // it from the database.
        if (!Exists(id))
            throw new ItemNotFoundError($"Project {id}");

        var cache = new MapCache();
        
        // Using left joins because inner joins will not return a result if the value isn't found, and not a null value.
        // This makes the auto-mapper of Dapper get confused, so you need to add 'splitOn' parameters which isn't worth it.
        // Left joins make the data null and make the expected type paramteres of the Query method still valid.
        // This means that the 'splitOn' parameter isn't needed.
        var result = _connection.Query(
            sql: """
            SELECT p.*, 
                pc.*,
                pct.*,                
                pcto.Id, pcto.Username, pcto.Email,
                pt.*,
                pto.Id, pto.Username, pto.Email,
                po.Id, po.Username, po.Email, 
                pmu.Id, pmu.Username, pmu.Email,
                piu.Id, piu.Username, piu.Email
            FROM "Project" p
                LEFT JOIN "User" po ON p.OwnerId = po.Id
                LEFT JOIN "Member" pm ON pm.ProjectId = p.Id 
                    LEFT JOIN "User" pmu ON pm.UserId = pmu.Id
                LEFT JOIN "Invite" pi ON pi.ProjectId = p.Id
                    LEFT JOIN "User" piu ON pi.UserId = piu.Id
                LEFT JOIN "Task" pt ON pt.ProjectId = p.Id AND pt.CategoryId IS NULL
                    LEFT JOIN "User" pto ON pt.OwnerId = pto.Id
                LEFT JOIN "Category" pc ON pc.ProjectId = p.Id
                    LEFT JOIN "Task" pct ON pct.CategoryId = pc.Id
                        LEFT JOIN "User" pcto ON pct.OwnerId = pcto.Id
            WHERE p.Id = @Id
            """,
            types: new []
            {
                typeof(Project),
                typeof(Category), typeof(Task), typeof(User),
                typeof(Task), typeof(User),
                typeof(User),
                typeof(User),
                typeof(User)
            },
            map: objects => MapProject(cache, objects),
            param: new { id }
        ).FirstOrDefault();
        
        // Check if the retrieved item is not null.
        if (result is null)
            throw new ItemNotFoundError($"Project {id}");

        return result;
    }

    /// <inheritdoc cref="IProjectService.Get"/>>
    public Guid? Identify(Guid? task = null, Guid? category = null)
    {
        if (task is not null)
            return _connection.QuerySingle<Guid>(
                """
                SELECT t.ProjectId
                FROM "Task" t
                WHERE t.Id = @Task;
                """,
                new { task }
            );
        
        return _connection.QuerySingle<Guid>(
                """
            SELECT c.ProjectId
            FROM "Category" c
            WHERE c.Id = @Category;
            """, 
            new { category }
        );
    }

    /// <inheritdoc cref="IProjectService.All"/>>
    public List<Project> All(Guid userId)
    {
        var cache = new MapCache();
        
        // Same thing as the single get applies here.
        var result = _connection.Query(
            """
            SELECT p.*,
                pc.*,
                pct.*,
                pcto.Id, pcto.Username, pcto.Email,
                pt.*,
                pto.Id, pto.Username, pto.Email,
                po.Id, po.Username, po.Email,
                pmu.Id, pmu.Username, pmu.Email,
                piu.Id, piu.Username, piu.Email
            FROM "Project"
                LEFT JOIN "User" u ON u.Id = @UserId
                LEFT JOIN "Member" m ON m.UserId = u.Id
                    LEFT JOIN "Project" p ON m.ProjectId = p.Id
                        LEFT JOIN "User" po ON p.OwnerId = po.Id
                        LEFT JOIN "Member" pm ON pm.ProjectId = p.Id
                            LEFT JOIN "User" pmu ON pm.UserId = pmu.Id
                        LEFT JOIN "Invite" pi ON pi.ProjectId = p.Id
                            LEFT JOIN "User" piu ON pi.UserId = piu.Id
                        LEFT JOIN "Category" pc ON pc.ProjectId = p.Id
                            LEFT JOIN "Task" pct ON pct.CategoryId = pc.Id
                                LEFT JOIN "User" pcto ON pct.OwnerId = pcto.Id
                        LEFT JOIN "Task" pt ON pt.ProjectId = p.Id AND pt.CategoryId IS NULL
                            LEFT JOIN "User" pto ON pt.OwnerId = pto.Id
            """,
            types: new []
            {
                typeof(Project),
                typeof(Category), typeof(Task), typeof(User),
                typeof(Task), typeof(User),
                typeof(User),
                typeof(User),
                typeof(User)
            },
            map: objects => MapProject(cache, objects),
            param: new { userId }
        ) ?? new List<Project>();
        
        return result.Where(r => r.Id != Guid.Empty)
            .Distinct()
            .ToList();
    }

    /// <exception cref="ArgumentOutOfRangeException">Thrown when a given member has an invalid <see cref="ChangeType"/>.</exception>
    /// <inheritdoc cref="IProjectService.Update"/>>
    public void Update(Guid id, ProjectUpdateConfiguration configuration)
    {
        // Update all properties except members
        if (configuration.Name is not null || 
            configuration.Description is not null || 
            configuration.OwnerId is not null)
            _connection.Execute(
                """
                UPDATE "Project" p
                SET 
                    Name = coalesce(@Name, Name),
                    Description = coalesce(@Description, Description),
                    OwnerId = coalesce(@OwnerId, OwnerId)
                WHERE p.Id = @Id
                """,
                new
                {
                    id,
                    configuration.Name,
                    configuration.Description,
                    configuration.OwnerId
                }
            );
        
        if (configuration.Invites is not null)
        {
            // Update project invites
            foreach (var (change, user) in configuration.Invites)
            {
                var command = change switch
                {
                    ChangeType.Add => """
                    INSERT INTO "Invite" (UserId, ProjectId)
                    VALUES (@UserId, @ProjectId);
                    """,
                    ChangeType.Remove => """
                    DELETE FROM "Invite" m
                    WHERE 
                        m.UserId = @UserId AND
                        m.ProjectId = @ProjectId
                    """,
                    _ => throw new ArgumentOutOfRangeException(nameof(configuration.Invites))
                };

                try
                {
                    _connection.Execute(command, new { UserId = user, ProjectId = id });
                }
                catch { /* ignored */ }
            }
        }

        if (configuration.Members is not null)
        {
            // Update project members
            foreach (var (change, member) in configuration.Members)
            {
                var command = change switch
                {
                    ChangeType.Add => """
                    INSERT INTO "Member" (UserId, ProjectId)
                    VALUES (@UserId, @ProjectId);
                    """,
                    ChangeType.Remove => """
                    DELETE FROM "Member" m
                    WHERE 
                        m.UserId = @UserId AND
                        m.ProjectId = @ProjectId
                    """,
                    _ => throw new ArgumentOutOfRangeException(nameof(configuration.Members))
                };

                try
                {
                    _connection.Execute(command, new { UserId = member, ProjectId = id });
                }
                catch { /* ignored */ }
            }
        }
    }

    /// <inheritdoc cref="IProjectService.Delete"/>>
    public void Delete(Guid id)
    {
        // Check if the item exists before attempting to delete
        // it from the database.
        if (!Exists(id))
            throw new ItemNotFoundError($"Project {id}");
    
        _connection.Execute("""DELETE FROM "Project" p WHERE p.Id = @Id""", new { id });
    }

    /// <summary>
    /// Map an SQL-response from <see cref="Dapper"/> to a single project.
    /// </summary>
    /// <param name="mapCache">The used cache for the mapping.</param>
    /// <param name="objects">The range of objects returned from the SQL-query.</param>
    /// <returns>The fully mapped project.</returns>
    private Project MapProject(MapCache mapCache, object[] objects)
    {
        if (objects[0] is not Project project)
            throw new ArgumentNullException(nameof(objects));

        // Retrieve project reference
        var projectRef = mapCache.Retrieve(project.Id, project);

        if (objects[1] is Category category)
        {
            // Retrieve category reference
            var categoryRef = mapCache.Retrieve(category.Id, category);
            
            // Add category to project reference
            if (projectRef.Categories.All(c => c.Id != category.Id))
                projectRef.Categories.Add(categoryRef);

            if (objects[2] is Task categoryTask && categoryRef.Tasks.All(t => t.Id != categoryTask.Id))
            {
                // Retrieve task reference
                var categoryTaskRef = mapCache.Retrieve(categoryTask.Id, categoryTask);
                
                // Add task to category reference
                categoryRef.Tasks.Add(categoryTaskRef);

                // Link owner of task to task reference
                if (objects[3] is User categoryTaskOwner)
                    categoryTaskRef.Owner = new Member(categoryTaskOwner);
            }
        }

        if (objects[4] is Task task)
        {
            var taskRef = mapCache.Retrieve(task.Id, task);
            if (projectRef.Tasks.All(t => t.Id != taskRef.Id))
                projectRef.Tasks.Add(taskRef);

            if (objects[5] is User taskOwner)
                taskRef.Owner = new Member(taskOwner);
        }
        
        // Link owner of project to project reference
        if (objects[6] is User owner) 
            projectRef.Owner = new Member(owner);
        
        // Add member to project reference
        if (objects[7] is User member && projectRef.Members.All(m => m.UserId != member.Id))
            projectRef.Members.Add(new Member(member));
        
        // Add invite to project reference
        if (objects[8] is User invite && projectRef.Invites.All(i => i.UserId != invite.Id))
            projectRef.Invites.Add(new Invite(invite));

        return projectRef;
    }
}