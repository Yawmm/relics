using Backend.Models.Users;
using System.Data;
using Backend.Errors;
using Backend.Models.Projects;
using Dapper;

namespace Backend.Core.Services.Users;

/// <summary>
/// A service used to manage <see cref="User"/> entities in the database.
/// </summary>
public interface IUserService
{
    /// <summary>
    /// Check whether or not a <see cref="User"/> by the given <see cref="Guid"/> exists.
    /// </summary>
    /// <param name="id">The guid of the <see cref="User"/> which should be checked.</param>
    /// <returns>Whether or not the <see cref="User"/> exists.</returns>
    bool Exists(Guid id);
    
    /// <summary>
    /// Check whether or not a <see cref="User"/> by the given email exists.
    /// </summary>
    /// <param name="email">The email of the <see cref="User"/> which should be checked.</param>
    /// <returns>Whether or not the <see cref="User"/> exists.</returns>
    bool Exists(string email);
    
    /// <summary>
    /// Create a new <see cref="User"/>.
    /// </summary>
    /// <param name="configuration">The configuration by which the <see cref="User"/> should be created.</param>
    /// <returns>The <see cref="Guid"/> of the newly created <see cref="User"/>.</returns>
    Guid? Create(UserCreateConfiguration configuration);

    /// <summary>
    /// Retrieve a <see cref="User"/> by the given <see cref="Guid"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="User"/>.</param>
    /// <returns>The retrieved <see cref="User"/>.</returns>
    User Get(Guid id);
    
    /// <summary>
    /// Retrieve a <see cref="User"/> by the given email.
    /// </summary>
    /// <param name="email">The email of the <see cref="User"/>.</param>
    /// <returns>The retrieved <see cref="User"/>.</returns>
    User Get(string email);
    
    /// <summary>
    /// Retrieve the invites to other projects the <see cref="User"/> has by the given <see cref="Guid"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="User"/>.</param>
    /// <returns>The retrieved <see cref="User"/>.</returns>
    List<Project> Invites(Guid id);

    /// <summary>
    /// Update an existing <see cref="User"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="User"/> which should be updated.</param>
    /// <param name="configuration">The configuration by which the <see cref="User"/> should be updated.</param>
    void Update(Guid id, UserUpdateConfiguration configuration);

    /// <summary>
    /// Delete an existing <see cref="User"/> by the given <see cref="Guid"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="User"/> which should be deleted.</param>
    void Delete(Guid id);
}

/// <inheritdoc cref="IUserService"/>
public class UserService : IUserService
{
    /// <summary>
    /// The connection to the current database.
    /// </summary>
    private readonly IDbConnection _connection;
    
    /// <summary>
    /// Initialize the <see cref="User"/> service.
    /// </summary>
    /// <param name="connection">The connection to the current database.</param>
    public UserService(IDbConnection connection)
    {
        _connection = connection;
    }

    /// <inheritdoc cref="IUserService.Exists(System.Guid)"/>
    public bool Exists(Guid id)
        => _connection.ExecuteScalar<bool>(
            """SELECT count(DISTINCT 1) FROM "User" u WHERE u.Id = @Id""", 
            new { id }
        );
    
    /// <inheritdoc cref="IUserService.Exists(System.String)"/>
    public bool Exists(string email)
        => _connection.ExecuteScalar<bool>(
            """SELECT count(DISTINCT 1) FROM "User" u WHERE u.Email = @Email""", 
            new { email }
        );

    /// <inheritdoc cref="IUserService.Create"/>
    public Guid? Create(UserCreateConfiguration configuration)
        => _connection.QuerySingle<Guid>(
            """
            INSERT INTO "User" (Username, Email, Hash)
            VALUES (@Username, @Email, @Hash)
            RETURNING Id
            """, new
            {
                configuration.Username, 
                configuration.Email, 
                configuration.Hash
            }
        );

    /// <inheritdoc cref="IUserService.Get(System.Guid)"/>
    public User Get(Guid id)
    {
        // Check if the item exists before attempting to retrieve
        // it from the database.
        if (!Exists(id))
            throw new ItemNotFoundError($"User {id}");

        var result = _connection.QuerySingle<User>(
            """
            SELECT u.*
            FROM "User" u
            WHERE u.Id = @Id
            """,
            new { id }
        );
        
        // Check if the retrieved item is not null.
        if (result is null)
            throw new ItemNotFoundError($"User {id}");

        return result;
    }
    
    /// <inheritdoc cref="IUserService.Get(System.String)"/>
    public User Get(string email)
    {
        // Check if the item exists before attempting to retrieve
        // it from the database.
        if (!Exists(email))
            throw new ItemNotFoundError($"User {email}");

        var result = _connection.QuerySingle<User>(
            """
            SELECT u.*
            FROM "User" u
            WHERE u.Email = @Email
            """,
            new { email }
        );
        
        // Check if the retrieved item is not null.
        if (result is null)
            throw new ItemNotFoundError($"User {email}");

        return result;
    }

    public List<Project> Invites(Guid id)
        => _connection.Query<Project>(
            """
            SELECT 
                p.Id, p.Name, p.Description
            FROM "Project" p  
                INNER JOIN "Invite" i ON i.ProjectId = p.Id
                    INNER JOIN "User" u ON i.UserId = u.Id
            WHERE u.Id = @UserId
            """,
            new { UserId = id }
        ).ToList();

    /// <inheritdoc cref="IUserService.Update"/>
    public void Update(Guid id, UserUpdateConfiguration configuration)
        => _connection.Execute(
            """
            UPDATE "User" u
            SET 
                Username = coalesce(@Username, Username)
            WHERE u.Id = @Id
            """,
            new
            {
                id,
                configuration.Username,
            }
        );

    /// <inheritdoc cref="IUserService.Delete"/>
    public void Delete(Guid id)
    {
        // Check if the item exists before attempting to delete
        // it from the database.
        if (!Exists(id))
            throw new ItemNotFoundError($"User {id}");
        
        _connection.Execute("""DELETE FROM "User" u WHERE u.Id = @Id""", new { id });
    }
}