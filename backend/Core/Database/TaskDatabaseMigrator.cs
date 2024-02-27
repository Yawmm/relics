using System.Data;
using Dapper;
using Task = Backend.Models.Tasks.Task;

namespace Backend.Core.Database;

/// <summary>
/// Migrations class used to migrate <see cref="Task"/> objects in the application.
/// </summary>
public class TaskDatabaseMigrator : IDatabaseMigrator
{
    private readonly IDbConnection _connection;
    
    public TaskDatabaseMigrator(IDbConnection connection)
    {
        _connection = connection;
    }
    
    /// <summary>
    /// Migrate up, adding the tables required for the <see cref="Task"/> object.
    /// </summary>
    public void Up()
    {
        _connection.Execute("""
            CREATE TABLE IF NOT EXISTS 
            "Task" (
                Id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
                Name VARCHAR(40),
                Description TEXT,
                IsFinished BOOL,
                      
                OwnerId UUID REFERENCES "User"(Id) ON DELETE CASCADE,
                ProjectId UUID REFERENCES "Project"(Id) ON DELETE CASCADE,
                CategoryId UUID NULL REFERENCES "Category"(Id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS
            "Comment" (
                Id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
                Content TEXT,
                Timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
                
                OwnerId UUID REFERENCES "User"(Id) ON DELETE CASCADE,
                TaskId UUID REFERENCES "Task"(Id) ON DELETE CASCADE
            )
            """
        );
    }

    /// <summary>
    /// Migrate down, removing the tables added in the <see cref="Up"/> migration.
    /// </summary>
    public void Down()
    {
        _connection.Execute("""
            DROP TABLE IF EXISTS "Task";
            DROP TABLE IF EXISTS "Comment";
            """
        );
    }
}