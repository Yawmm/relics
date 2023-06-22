namespace Backend.Core.Database;

/// <summary>
/// Interface used to define common database migration functions.
/// </summary>
public interface IDatabaseMigrator
{
    /// <summary>
    /// Add the required tables for the object which is targeted in the migration.
    /// </summary>
    void Up();
    
    /// <summary>
    /// Remove the tables added in the <see cref="Up"/> migration.
    /// </summary>
    void Down();
}