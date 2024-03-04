using System.Data;
using Backend.Errors;
using Backend.Models.General;
using Backend.Models.Projects;
using Dapper;
using Tag = Backend.Models.Projects.Tag;

namespace Backend.Core.Services.Projects;

/// <summary>
/// A service used to manage <see cref="Tag"/> entities in the database.
/// </summary>
public interface ITagService
{
    /// <summary>
    /// Check whether or not a <see cref="Tag"/> by the given <see cref="Guid"/> exists.
    /// </summary>
    /// <param name="id">The guid of the <see cref="Tag"/> which should be checked.</param>
    /// <returns>Whether or not the <see cref="Tag"/> exists.</returns>
    bool Exists(Guid id);
    
    /// <summary>
    /// Create a new <see cref="Tag"/>.
    /// </summary>
    /// <param name="configuration">The configuration by which the <see cref="Tag"/> should be created.</param>
    /// <returns>The <see cref="Guid"/> of the newly created <see cref="Tag"/>.</returns>
    Guid Create(TagCreateConfiguration configuration);

    /// <summary>
    /// Retrieve a <see cref="Tag"/> by the given <see cref="Guid"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="Tag"/>.</param>
    /// <returns>The retrieved <see cref="Tag"/>, or an <see cref="IError"/> if an error ocurred.</returns>
    Tag Get(Guid id);

    /// <summary>
    /// Update an existing <see cref="Tag"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="Tag"/> which should be updated.</param>
    /// <param name="configuration">The configuration by which the <see cref="Tag"/> should be updated.</param>
    void Update(Guid id, TagUpdateConfiguration configuration);

    /// <summary>
    /// Delete an existing <see cref="Tag"/> by the given <see cref="Guid"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="Tag"/> which should be deleted.</param>
    void Delete(Guid id);
}

/// <inheritdoc cref="ITagService"/>
public class TagService : ITagService
{
    /// <summary>
    /// The connection to the current database.
    /// </summary>
    private readonly IDbConnection _connection;
    
    /// <summary>
    /// Initialize the <see cref="Tag"/> service.
    /// </summary>
    /// <param name="connection">The connection to the current database.</param>
    public TagService(IDbConnection connection)
    {
        _connection = connection;
    }
    
    /// <inheritdoc cref="ITagService.Exists"/>
    public bool Exists(Guid id)
        => _connection.ExecuteScalar<bool>(
                """SELECT count(DISTINCT 1) FROM "Tag" t WHERE t.Id = @Id""", 
                new { id }
            );

    /// <inheritdoc cref="ITagService.Create"/>
    public Guid Create(TagCreateConfiguration configuration)
        =>  _connection.QuerySingle<Guid>(
            """
            INSERT INTO "Tag" (Name, Color, ProjectId)
            VALUES (@Name, @Color, @ProjectId)
            RETURNING Id
            """, 
            new
            {
                configuration.Name, 
                configuration.Color,
                configuration.ProjectId
            }
        );

    /// <inheritdoc cref="ITagService.Get"/>
    public Tag Get(Guid id)
    {
        // Check if the item exists before attempting to retrieve
        // it from the database.
        if (!Exists(id))
            throw new ItemNotFoundError($"Tag {id}");

        var result = _connection.QuerySingle<Tag>(
            """
            SELECT t.*
            FROM "Tag" t 
            WHERE t.Id = @Id
            """,
            new { id }
        );
        
        // Check if the retrieved item is not null.
        if (result is null)
            throw new ItemNotFoundError($"Tag {id}");

        return result;
    }

    /// <inheritdoc cref="ITagService.Update"/>
    public void Update(Guid id, TagUpdateConfiguration configuration)
    {
        if (configuration.Name is not null || configuration.Color is not null)
            _connection.Execute(
                """
                UPDATE "Tag" t
                SET
                    Name = coalesce(@Name, Name),
                    Color = coalesce(@Color, Color)
                WHERE t.Id = @Id
                """,
                new
                {
                    id,
                    configuration.Name,
                    configuration.Color
                }
            );
        
        if (configuration.Labels is not null)
        {
            // Update labels
            foreach (var (change, task) in configuration.Labels)
            {
                var command = change switch
                {
                    ChangeType.Add => """
                                      INSERT INTO "Label" (TaskId, TagId)
                                      VALUES (@TaskId, @TagId);
                                      """,
                    ChangeType.Remove => """
                                         DELETE FROM "Label" l
                                         WHERE
                                             l.TaskId = @TaskId AND
                                             l.TagId = @TagId
                                         """,
                    _ => throw new ArgumentOutOfRangeException(nameof(configuration.Labels))
                };

                try
                {
                    _connection.Execute(command, new { TaskId = task, TagId = id });
                }
                catch { /* ignored */ }
            }
        }
    }

    /// <inheritdoc cref="ITagService.Delete"/>
    public void Delete(Guid id)
    {
        // Check if the item exists before attempting to delete
        // it from the database.
        if (!Exists(id))
            throw new ItemNotFoundError($"Tag {id}");
        
        _connection.Execute("""DELETE FROM "Tag" c WHERE c.Id = @Id""", new { id });
    }
}