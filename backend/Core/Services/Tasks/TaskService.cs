using System.Data;
using Backend.Errors;
using Backend.Models.Tasks;
using Backend.Models.Users;
using Backend.Utility;
using Dapper;
using Task = Backend.Models.Tasks.Task;

namespace Backend.Core.Services.Tasks;

/// <summary>
/// A service used to manage <see cref="Task"/> entities in the database.
/// </summary>
public interface ITaskService
{
    /// <summary>
    /// Check whether or not a <see cref="Task"/> by the given <see cref="Guid"/> exists.
    /// </summary>
    /// <param name="id">The guid of the <see cref="Task"/> which should be checked.</param>
    /// <returns>Whether or not the <see cref="Task"/> exists.</returns>
    bool Exists(Guid id);
    
    /// <summary>
    /// Create a new <see cref="Task"/>.
    /// </summary>
    /// <param name="configuration">The configuration by which the <see cref="Task"/> should be created.</param>
    /// <returns>The <see cref="Guid"/> of the newly created <see cref="Task"/>.</returns>
    Guid Create(TaskCreateConfiguration configuration);
    
    /// <summary>
    /// Retrieve a <see cref="Guid"/> by the given linked comment <see cref="Guid"/>.
    /// </summary>
    /// <param name="comment">The <see cref="Guid"/> of the <see cref="Comment"/> under the <see cref="Task"/>.</param>
    /// <returns>The retrieved <see cref="Guid"/> of the matching project.</returns>
    Guid? Identify(Guid comment);

    /// <summary>
    /// Retrieve a <see cref="Task"/> by the given <see cref="Guid"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="Task"/>.</param>
    /// <returns>The retrieved <see cref="Task"/>.</returns>
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
    
    /// <inheritdoc cref="ITaskService.Identify"/>>
    public Guid? Identify(Guid comment)
    {
        var result = _connection.QuerySingleOrDefault<Guid>(
            """
            SELECT c.TaskId
            FROM "Comment" c 
            WHERE c.Id = @Comment;
            """,
            new { comment }
        );

        return result == Guid.Empty ? null : result;
    }

    /// <inheritdoc cref="ITaskService.Get"/>
    public Task Get(Guid id)
    {
        // Check if the item exists before attempting to retrieve
        // it from the database.
        if (!Exists(id))
            throw new ItemNotFoundError($"Task {id}");

        var cache = new MapCache();
        var result = _connection.Query<Task, User, Comment, User, Task>(
            """
            SELECT t.*,
                    o.Id, o.Username, o.Email,
                    
                    c.Id, c.Content, c.Timestamp,
                    co.Id, co.Username, co.Email
            FROM "Task" t 
                LEFT JOIN "User" o ON t.OwnerId = o.Id
                LEFT JOIN "Comment" c ON c.TaskId = t.Id
                    LEFT JOIN "User" co ON c.OwnerId = co.Id
            WHERE t.Id = @Id
            """,
            (task, owner, comment, author) =>
            {
                var taskRef = cache.Retrieve(task.Id, task);
                if (owner is not null) 
                    taskRef.Owner = new Member(owner);

                if (comment is not null && taskRef.Comments.All(c => c.Id != comment.Id))
                {
                    var commentRef = cache.Retrieve(comment.Id, comment);
                    taskRef.Comments.Add(commentRef);
                    
                    if (author is not null)
                        commentRef.Owner = new Member(author);
                }

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
        var result = _connection.Query<Task, User, Comment, User, Task>(
            """
            SELECT t.*, 
                   o.Id, o.Username, o.Email,
                   
                   c.Id, c.Content, c.Timestamp,
                   co.Id, co.Username, co.Email
            FROM "Task" t 
                LEFT JOIN "User" o ON t.OwnerId = o.Id
                LEFT JOIN "Comment" c ON c.TaskId = t.Id
                    LEFT JOIN "User" co ON c.OwnerId = co.Id
            WHERE t.OwnerId = @UserId
            """,
            (task, owner, comment, author) =>
            {
                var taskRef = cache.Retrieve(task.Id, task);
                if (owner is not null) 
                    taskRef.Owner = new Member(owner);

                if (comment is not null && taskRef.Comments.All(c => c.Id != comment.Id))
                {
                    var commentRef = cache.Retrieve(comment.Id, comment);
                    taskRef.Comments.Add(commentRef);
                    
                    if (author is not null)
                        commentRef.Owner = new Member(author);
                }

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