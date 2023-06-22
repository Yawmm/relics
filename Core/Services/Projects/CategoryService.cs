using System.Data;
using Backend.Errors;
using Backend.Models.Projects;
using Dapper;

namespace Backend.Core.Services.Projects;

/// <summary>
/// A service used to manage <see cref="Category"/> entities in the database.
/// </summary>
public interface ICategoryService
{
    /// <summary>
    /// Check whether or not a <see cref="Category"/> by the given <see cref="Guid"/> exists.
    /// </summary>
    /// <param name="id">The guid of the <see cref="Category"/> which should be checked.</param>
    /// <returns>Whether or not the <see cref="Category"/> exists.</returns>
    bool Exists(Guid id);
    
    /// <summary>
    /// Create a new <see cref="Category"/>.
    /// </summary>
    /// <param name="configuration">The configuration by which the <see cref="Category"/> should be created.</param>
    /// <returns>The <see cref="Guid"/> of the newly created <see cref="Category"/>.</returns>
    Guid Create(CategoryCreateConfiguration configuration);

    /// <summary>
    /// Retrieve a <see cref="Category"/> by the given <see cref="Guid"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="Category"/>.</param>
    /// <returns>The retrieved <see cref="Category"/>, or an <see cref="IError"/> if an error ocurred.</returns>
    Category Get(Guid id);

    /// <summary>
    /// Update an existing <see cref="Category"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="Category"/> which should be updated.</param>
    /// <param name="configuration">The configuration by which the <see cref="Category"/> should be updated.</param>
    void Update(Guid id, CategoryUpdateConfiguration configuration);

    /// <summary>
    /// Delete an existing <see cref="Category"/> by the given <see cref="Guid"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="Category"/> which should be deleted.</param>
    void Delete(Guid id);
}

/// <inheritdoc cref="ICategoryService"/>
public class CategoryService : ICategoryService
{
    /// <summary>
    /// The connection to the current database.
    /// </summary>
    private readonly IDbConnection _connection;
    
    /// <summary>
    /// Initialize the <see cref="Category"/> service.
    /// </summary>
    /// <param name="connection">The connection to the current database.</param>
    public CategoryService(IDbConnection connection)
    {
        _connection = connection;
    }
    
    /// <inheritdoc cref="ICategoryService.Exists"/>
    public bool Exists(Guid id)
        => _connection.ExecuteScalar<bool>(
                """SELECT count(DISTINCT 1) FROM "Category" c WHERE c.Id = @Id""", 
                new { id }
            );

    /// <inheritdoc cref="ICategoryService.Create"/>
    public Guid Create(CategoryCreateConfiguration configuration)
        =>  _connection.QuerySingle<Guid>(
            """
            INSERT INTO "Category" (Name, ProjectId)
            VALUES (@Name, @ProjectId)
            RETURNING Id
            """, 
            new
            {
                configuration.Name, 
                configuration.ProjectId
            }
        );

    /// <inheritdoc cref="ICategoryService.Get"/>
    public Category Get(Guid id)
    {
        // Check if the item exists before attempting to retrieve
        // it from the database.
        if (!Exists(id))
            throw new ItemNotFoundError($"Category {id}");

        var result = _connection.QuerySingle<Category>(
            """
            SELECT c.*
            FROM "Category" c 
            WHERE c.Id = @Id
            """,
            new { id }
        );
        
        // Check if the retrieved item is not null.
        if (result is null)
            throw new ItemNotFoundError($"Category {id}");

        return result;
    }

    /// <inheritdoc cref="ICategoryService.Update"/>
    public void Update(Guid id, CategoryUpdateConfiguration configuration)
        => _connection.Execute(
            """
            UPDATE "Category" c
            SET 
                Name = coalesce(@Name, Name)
            WHERE c.Id = @Id
            """,
            new
            {
                id,
                configuration.Name,
            }
        );

    /// <inheritdoc cref="ICategoryService.Delete"/>
    public void Delete(Guid id)
    {
        // Check if the item exists before attempting to delete
        // it from the database.
        if (!Exists(id))
            throw new ItemNotFoundError($"Category {id}");
        
        _connection.Execute("""DELETE FROM "Category" c WHERE c.Id = @Id""", new { id });
    }
}