using System.Data;
using Backend.Errors;
using Backend.Models.Tasks;
using Backend.Models.Users;
using Backend.Utility;
using Dapper;
using Task = Backend.Models.Tasks.Task;

namespace Backend.Core.Services.Tasks;

/// <summary>
/// A service used to manage <see cref="System.Threading.Tasks.Task"/> entities in the database.
/// </summary>
public interface ITaskService
{
    /// <summary>
    /// Check whether or not a <see cref="System.Threading.Tasks.Task"/> by the given <see cref="Guid"/> exists.
    /// </summary>
    /// <param name="id">The guid of the <see cref="System.Threading.Tasks.Task"/> which should be checked.</param>
    /// <returns>Whether or not the <see cref="System.Threading.Tasks.Task"/> exists.</returns>
    bool Exists(Guid id);
    
    /// <summary>
    /// Create a new <see cref="System.Threading.Tasks.Task"/>.
    /// </summary>
    /// <param name="configuration">The configuration by which the <see cref="System.Threading.Tasks.Task"/> should be created.</param>
    /// <returns>The <see cref="Guid"/> of the newly created <see cref="System.Threading.Tasks.Task"/>.</returns>
    Guid Create(TaskCreateConfiguration configuration);

    /// <summary>
    /// Retrieve a <see cref="System.Threading.Tasks.Task"/> by the given <see cref="Guid"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="System.Threading.Tasks.Task"/>.</param>
    /// <returns>The retrieved <see cref="System.Threading.Tasks.Task"/>.</returns>
    Task Get(Guid id);
    
    /// <summary>
    /// Retrieve the range of <see cref="Task"/> objects linked to a user by the given user <see cref="Guid"/>.
    /// </summary>
    /// <param name="userId">The <see cref="Guid"/> of the <see cref="User"/>.</param>
    /// <returns>The retrieved range of <see cref="Task"/> objects linked to the user.</returns>
    List<Task> All(Guid userId);

    /// <summary>
    /// Update an existing <see cref="Task"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="Task"/> which should be updated.</param>
    /// <param name="configuration">The configuration by which the <see cref="Task"/> should be updated.</param>
    void Update(Guid id, TaskUpdateConfiguration configuration);

    /// <summary>
    /// Delete an existing <see cref="Task"/> by the given <see cref="Guid"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="Task"/> which should be deleted.</param>
    void Delete(Guid id);
}

/// <inheritdoc cref="ITaskService"/>
public class TaskService : ITaskService
{
    /// <summary>
    /// The connection to the current database.
    /// </summary>
    private readonly IDbConnection _connection;
    
    /// <summary>
    /// Initialize the <see cref="Task"/> service.
    /// </summary>
    /// <param name="connection">The connection to the current database.</param>
    public TaskService(IDbConnection connection)
    {
        _connection = connection;
    }
    
    /// <inheritdoc cref="ITaskService.Exists"/>
    public bool Exists(Guid id)
        => _connection.ExecuteScalar<bool>(
                """SELECT count(DISTINCT 1) FROM "Task" t WHERE t.Id = @Id""", 
                new { id }
            );

    /// <inheritdoc cref="ITaskService.Create"/>
    public Guid Create(TaskCreateConfiguration configuration)
        =>  _connection.QuerySingle<Guid>(
            """
            INSERT INTO "Task" (Name, Description, IsFinished, OwnerId, ProjectId, CategoryId)
            VALUES (@Name, @Description, @IsFinished, @OwnerId, @ProjectId, @CategoryId)
            RETURNING Id
            """, 
            new
            {
                configuration.Name,
                configuration.Description,
                configuration.IsFinished,
                configuration.ProjectId,
                configuration.CategoryId,
                configuration.OwnerId,
            }
        );

    /// <inheritdoc cref="ITaskService.Get"/>
    public Task Get(Guid id)
    {
        // Check if the item exists before attempting to retrieve
        // it from the database.
        if (!Exists(id))
            throw new ItemNotFoundError($"Task {id}");

        var cache = new MapCache();
        var result = _connection.Query<Task, User, Task>(
            """
            SELECT t.*,
                    o.Id, o.Username, o.Email
            FROM "Task" t 
                LEFT JOIN "User" o ON t.OwnerId = o.Id
            WHERE t.Id = @Id
            """,
            (task, owner) =>
            {
                var taskRef = cache.Retrieve(task.Id, task);
                if (owner is not null) taskRef.Owner = new Member(owner);

                return taskRef;
            },
            new { id }
        ).First();
        
        // Check if the retrieved item is not null.
        if (result is null)
            throw new ItemNotFoundError($"Task {id}");

        return result;
    }

    /// <inheritdoc cref="ITaskService.Get"/>
    public List<Task> All(Guid userId)
    {
        var cache = new MapCache();
        var result = _connection.Query<Task, User, Task>(
            """
            SELECT t.*, 
                   o.Id, o.Username, o.Email
            FROM "Task" t 
                LEFT JOIN "User" o ON t.OwnerId = o.Id
            WHERE t.OwnerId = @UserId
            """,
            (task, owner) =>
            {
                var taskRef = cache.Retrieve(task.Id, task);
                if (owner is not null) taskRef.Owner = new Member(owner);

                return taskRef;
            },
            new { userId }
        )
            .Distinct()
            .ToList();

        return result;
    }

    /// <inheritdoc cref="ITaskService.Update"/>
    public void Update(Guid id, TaskUpdateConfiguration configuration)
        => _connection.Execute(
            """
            UPDATE "Task" t
            SET 
                Name = coalesce(@Name, Name),
                Description = coalesce(@Description, Description),
                IsFinished = coalesce(@IsFinished, IsFinished),
                CategoryId = @CategoryId
            WHERE t.Id = @Id
            """,
            new
            {
                id,
                configuration.CategoryId,
                configuration.Name,
                configuration.Description,
                configuration.IsFinished,
            }
        );

    /// <inheritdoc cref="ITaskService.Delete"/>
    public void Delete(Guid id)
    {
        // Check if the item exists before attempting to delete
        // it from the database.
        if (!Exists(id))
            throw new ItemNotFoundError($"Task {id}");
        
        _connection.Execute("""DELETE FROM "Task" t WHERE t.Id = @Id""", new { id });
    }
}