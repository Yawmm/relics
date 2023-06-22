using System.Data;
using Backend.Models.Users;
using Dapper;

namespace Backend.Core.Database;

/// <summary>
/// Migrations class used to migrate <see cref="User"/> objects in the application.
/// </summary>
public class UserDatabaseMigrator : IDatabaseMigrator
{
    private readonly IDbConnection _connection;
    
    public UserDatabaseMigrator(IDbConnection connection)
    {
        _connection = connection;
    }
    
    /// <summary>
    /// Migrate up, adding the tables required for the <see cref="User"/> object.
    /// </summary>
    public void Up()
    {
        _connection.Execute("""
            CREATE TABLE IF NOT EXISTS 
            "User" (
                Id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
                Username VARCHAR(20),
                Email VARCHAR(50),

                Hash VARCHAR(60) NULL
            );
            """
        );
    }

    /// <summary>
    /// Migrate down, removing the tables added in the <see cref="Up"/> migration.
    /// </summary>
    public void Down()
    {
        _connection.Execute("""
            DROP TABLE IF EXISTS "User";
            """
        );
    }
}