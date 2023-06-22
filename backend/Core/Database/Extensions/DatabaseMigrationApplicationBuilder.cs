namespace Backend.Core.Database.Extensions;

/// <summary>
/// Extension class used for adding database migrations to the application.
/// </summary>
internal static class DatabaseMigrationApplicationBuilder
{
    /// <summary>
    /// Migrate upwards for all the objects in the application which have registered an <see cref="IDatabaseMigrator"/>.
    /// </summary>
    /// <param name="applicationBuilder">The current application builder.</param>
    /// <exception cref="ArgumentNullException">Thrown when the application builder is null.</exception>
    public static void UseDatabaseMigrations(this IApplicationBuilder applicationBuilder)
    {
        // Application builder guard
        ArgumentNullException.ThrowIfNull(applicationBuilder);

        // Migrate all objects upwards
        foreach (var migrator in applicationBuilder.ApplicationServices.GetServices<IDatabaseMigrator>())
            migrator.Up();
    }
    
    /// <summary>
    /// Migrat upwards for a single given migrator.
    /// </summary>
    /// <param name="applicationBuilder">The current application builder.</param>
    /// <param name="action">The action which configures the database migrator.</param>
    /// <typeparam name="TMigrator">The type of the <see cref="IDatabaseMigrator"/>.</typeparam>
    /// <exception cref="ApplicationException">Thrown when the given <see cref="IDatabaseMigrator"/> could not be found in the registered services.</exception>
    public static void UseDatabaseMigration<TMigrator>(this IApplicationBuilder applicationBuilder, Action<TMigrator> action)
        where TMigrator : class, IDatabaseMigrator
    {
        // Application builder guard
        ArgumentNullException.ThrowIfNull(applicationBuilder);
        
        var migrator = applicationBuilder.ApplicationServices.GetService<TMigrator>();
        if (migrator is null)
            throw new ApplicationException("Unable to add and retrieve database migrator.");
        
        action(migrator);
    }
}