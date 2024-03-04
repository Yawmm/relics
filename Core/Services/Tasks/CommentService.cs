using System.Data;
using Backend.Errors;
using Backend.Models.Tasks;
using Backend.Models.Users;
using Backend.Utility;
using Dapper;

namespace Backend.Core.Services.Tasks;

/// <summary>
/// A service used to manage <see cref="Comment"/> entities in the database.
/// </summary>
public interface ICommentService
{
    /// <summary>
    /// Check whether or not a <see cref="Comment"/> by the given <see cref="Guid"/> exists.
    /// </summary>
    /// <param name="id">The guid of the <see cref="Comment"/> which should be checked.</param>
    /// <returns>Whether or not the <see cref="Comment"/> exists.</returns>
    bool Exists(Guid id);
    
    /// <summary>
    /// Create a new <see cref="Comment"/>.
    /// </summary>
    /// <param name="configuration">The configuration by which the <see cref="Comment"/> should be created.</param>
    /// <returns>The <see cref="Guid"/> of the newly created <see cref="Comment"/>.</returns>
    Guid Create(CommentCreateConfiguration configuration);

    /// <summary>
    /// Retrieve a <see cref="Comment"/> by the given <see cref="Guid"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="Comment"/>.</param>
    /// <returns>The retrieved <see cref="Comment"/>.</returns>
    Comment Get(Guid id);
    
    /// <summary>
    /// Retrieve a range of <see cref="Comment"/> objects by the given <see cref="Models.Tasks.Task"/> <see cref="Guid"/>.
    /// </summary>
    /// <param name="taskId">The <see cref="Guid"/> of the parent <see cref="Models.Tasks.Task"/>.</param>
    /// <returns>The retrieved <see cref="Comment"/>.</returns>
    List<Comment> All(Guid taskId);

    /// <summary>
    /// Delete an existing <see cref="Comment"/> by the given <see cref="Guid"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="Comment"/> which should be deleted.</param>
    void Delete(Guid id);
}

/// <inheritdoc cref="ICommentService"/>
public class CommentService : ICommentService
{
    /// <summary>
    /// The connection to the current database.
    /// </summary>
    private readonly IDbConnection _connection;
    
    /// <summary>
    /// Initialize the <see cref="Comment"/> service.
    /// </summary>
    /// <param name="connection">The connection to the current database.</param>
    public CommentService(IDbConnection connection)
    {
        _connection = connection;
    }
    
    /// <inheritdoc cref="ICommentService.Exists"/>>
    public bool Exists(Guid id)
        => _connection.ExecuteScalar<bool>(
            """SELECT count(DISTINCT 1) FROM "Comment" c WHERE c.Id = @Id""", 
            new { id }
        );

    /// <inheritdoc cref="ICommentService.Create"/>>
    public Guid Create(CommentCreateConfiguration configuration)
        =>  _connection.QuerySingle<Guid>(
            """
            INSERT INTO "Comment" (Content, Timestamp, OwnerId, TaskId)
            VALUES (@Content, coalesce(@Timestamp, now()), @OwnerId, @TaskId)
            RETURNING Id
            """, 
            new
            {
                configuration.Content,
                configuration.Timestamp,
                configuration.OwnerId,
                configuration.TaskId
            }
        );

    /// <inheritdoc cref="ICommentService.Get"/>>
    public Comment Get(Guid id)
    {
        // Check if the item exists before attempting to retrieve
        // it from the database.
        if (!Exists(id))
            throw new ItemNotFoundError($"Comment {id}");

        var cache = new MapCache();
        var result = _connection.Query<Comment, User, Comment>(
            """
            SELECT c.Id, c.Content, c.Timestamp,
                   o.Id, o.Username, o.Email
            FROM "Comment" c
                LEFT JOIN "User" o ON c.OwnerId = o.Id
            WHERE c.Id = @Id
            """,
            (comment, owner) =>
            {
                var commentRef = cache.Retrieve(comment.Id, comment);
                if (owner is not null) commentRef.Owner = new Member(owner);

                return commentRef;
            },
            new { id }
        ).First();
        
        // Check if the retrieved item is not null.
        if (result is null)
            throw new ItemNotFoundError($"Comment {id}");

        return result;
    }

    /// <inheritdoc cref="ICommentService.All"/>>
    public List<Comment> All(Guid taskId)
    {
        var cache = new MapCache();
        var result = _connection.Query<Comment, User, Comment>(
                """
                SELECT c.Id, c.Content, c.Timestamp,
                       o.Id, o.Username, o.Email
                FROM "Comment" c
                    LEFT JOIN "User" o ON c.OwnerId = o.Id
                WHERE c.TaskId = @TaskId
                """,
                (comment, owner) =>
                {
                    var commentRef = cache.Retrieve(comment.Id, comment);
                    if (owner is not null) commentRef.Owner = new Member(owner);

                    return commentRef;
                },
                new { taskId }
            )
            .Distinct()
            .ToList();

        return result;
    }

    /// <inheritdoc cref="ICommentService.Delete"/>>
    public void Delete(Guid id)
    {
        // Check if the item exists before attempting to delete
        // it from the database.
        if (!Exists(id))
            throw new ItemNotFoundError($"Comment {id}");
        
        _connection.Execute("""DELETE FROM "Comment" c WHERE c.Id = @Id""", new { id });
    }
}