using System.Data;
using Backend.Models.Teams;
using Dapper;

namespace Backend.Core.Database;

/// <summary>
/// Migrations class used to migrate <see cref="Team"/> objects in the application.
/// </summary>
public class TeamDatabaseMigrator : IDatabaseMigrator
{
    private readonly IDbConnection _connection;
    
    public TeamDatabaseMigrator(IDbConnection connection)
    {
        _connection = connection;
    }
    
    /// <summary>
    /// Migrate up, adding the tables required for the <see cref="Team"/> object.
    /// </summary>
    public void Up()
    {
        _connection.Execute("""
            CREATE TABLE IF NOT EXISTS 
            "Team" (
                Id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
                Name VARCHAR(20),
                
                OwnerId UUID REFERENCES "User"(Id)
            );

            CREATE TABLE IF NOT EXISTS
            "TeamMember" (
                UserId UUID NOT NULL REFERENCES "User"(Id) ON DELETE CASCADE,
                TeamId UUID NOT NULL REFERENCES "Team"(Id) ON DELETE CASCADE
            );
            
            ALTER TABLE "TeamMember" DROP CONSTRAINT IF EXISTS Team_member_unique_user_team_constraint;
            ALTER TABLE "TeamMember"
                ADD CONSTRAINT Team_member_unique_user_team_constraint
                    UNIQUE(UserID, TeamId);

            CREATE TABLE IF NOT EXISTS
            "TeamInvite" (
                UserId UUID NOT NULL REFERENCES "User"(Id) ON DELETE CASCADE,
                TeamId UUID NOT NULL REFERENCES "Team"(Id) ON DELETE CASCADE
            );
            
            ALTER TABLE "TeamInvite" DROP CONSTRAINT IF EXISTS Team_invite_unique_user_team_constraint;
            ALTER TABLE "TeamInvite"
                ADD CONSTRAINT Team_invite_unique_user_team_constraint
                    UNIQUE(UserId, TeamId);

            CREATE TABLE IF NOT EXISTS
            "Link" (
                TeamId UUID NOT NULL REFERENCES "Team"(Id) ON DELETE CASCADE,
                ProjectId UUID NOT NULL REFERENCES "Project"(Id) ON DELETE CASCADE
            );
            
            ALTER TABLE "Link" DROP CONSTRAINT IF EXISTS Link_unique_team_project_constraint;
            ALTER TABLE "Link"
                ADD CONSTRAINT Link_unique_team_project_constraint
                    UNIQUE(TeamId, ProjectID);
            """
        );
    }

    /// <summary>
    /// Migrate down, removing the tables added in the <see cref="Up"/> migration.
    /// </summary>
    public void Down()
    {
        _connection.Execute("""
            DROP TABLE IF EXISTS "Team";
            DROP TABLE IF EXISTS "TeamMember";
            DROP TABLE IF EXISTS "TeamInvite";
            DROP TABLE IF EXISTS "Link";
            """
        );
    }
}