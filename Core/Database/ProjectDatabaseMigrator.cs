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
            "ProjectMember" (
                UserId UUID NOT NULL REFERENCES "User"(Id) ON DELETE CASCADE,
                ProjectId UUID NOT NULL REFERENCES "Project"(Id) ON DELETE CASCADE
            );

            ALTER TABLE "ProjectMember" DROP CONSTRAINT IF EXISTS Project_member_unique_user_project_constraint;
            ALTER TABLE "ProjectMember"
                ADD CONSTRAINT Project_member_unique_user_project_constraint
                    UNIQUE(UserId, ProjectID);

            CREATE TABLE IF NOT EXISTS
            "ProjectInvite" (
                UserId UUID NOT NULL REFERENCES "User"(Id) ON DELETE CASCADE,
                ProjectId UUID NOT NULL REFERENCES "Project"(Id) ON DELETE CASCADE
            );

            ALTER TABLE "ProjectInvite" DROP CONSTRAINT IF EXISTS Project_invite_unique_user_project_constraint;
            ALTER TABLE "ProjectInvite"
                ADD CONSTRAINT Project_invite_unique_user_project_constraint
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
            DROP TABLE IF EXISTS "ProjectMember";
            DROP TABLE IF EXISTS "ProjectInvite";
            DROP TABLE IF EXISTS "Category";
            """
        );
    }
}