using System.Data;
using Backend.Models.Projects;
using Dapper;

namespace Backend.Core.Database;

/// <summary>
/// Migrations class used to migrate <see cref="Project"/> objects in the application.
/// </summary>
public class ProjectDatabaseMigrator : IDatabaseMigrator
{
    private readonly IDbConnection _connection;
    
    public ProjectDatabaseMigrator(IDbConnection connection)
    {
        _connection = connection;
    }
    
    /// <summary>
    /// Migrate up, adding the tables required for the <see cref="Project"/> object.
    /// </summary>
    public void Up()
    {
        _connection.Execute("""
            CREATE TABLE IF NOT EXISTS 
            "Project" (
                Id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
                Name VARCHAR(20),
                Description TEXT,
                IsFavourite BOOLEAN,
                      
                OwnerId UUID REFERENCES "User"(Id)
            );

            CREATE TABLE IF NOT EXISTS
            "Member" (
                UserId UUID NOT NULL REFERENCES "User"(Id) ON DELETE CASCADE,
                ProjectId UUID NOT NULL REFERENCES "Project"(Id) ON DELETE CASCADE
            );

            ALTER TABLE "Member" DROP CONSTRAINT IF EXISTS Member_unique_user_project_constraint;
            ALTER TABLE "Member"
                ADD CONSTRAINT Member_unique_user_project_constraint
                    UNIQUE(UserId, ProjectID);

            CREATE TABLE IF NOT EXISTS
            "Invite" (
                UserId UUID NOT NULL REFERENCES "User"(Id) ON DELETE CASCADE,
                ProjectId UUID NOT NULL REFERENCES "Project"(Id) ON DELETE CASCADE
            );

            ALTER TABLE "Invite" DROP CONSTRAINT IF EXISTS Invite_unique_user_project_constraint;
            ALTER TABLE "Invite"
                ADD CONSTRAINT Invite_unique_user_project_constraint
                    UNIQUE(UserId, ProjectID);

            CREATE TABLE IF NOT EXISTS
            "Category" (
                Id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
                Name VARCHAR(20),
                
                ProjectId UUID REFERENCES "Project"(Id) ON DELETE CASCADE
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
            DROP TABLE IF EXISTS "Project";
            DROP TABLE IF EXISTS "Member";
            DROP TABLE IF EXISTS "Invite";
            DROP TABLE IF EXISTS "Category";
            """
        );
    }
}