using System.Data;
using Backend.Core.Database;
using Backend.Core.Services.Authentication;
using Backend.Core.Services.Projects;
using Backend.Core.Services.Tasks;
using Backend.Core.Services.Teams;
using Backend.Core.Services.Users;
using Npgsql;

namespace Backend.Core.Services.Extensions;

/// <summary>
/// Extension class used to add default application services to the application.
/// </summary>
internal static class ApplicationServiceCollection
{
    /// <summary>
    /// Add database services to the current service collection.
    /// </summary>
    /// <param name="services">The current service collection.</param>
    /// <exception cref="ArgumentNullException">Thrown when the given service collection is null.</exception>
    public static void AddApplicationDatabase(this IServiceCollection services)
    {
        // Services guard
        ArgumentNullException.ThrowIfNull(services);

        // Add database connection
        services.AddTransient<IDbConnection>(
            provider => new NpgsqlConnection(
                provider.GetService<IConfiguration>()
                    ?.GetConnectionString("Postgres")
            )
        );

        // Add migrations
        services.AddTransient<IDatabaseMigrator, UserDatabaseMigrator>();
        services.AddTransient<IDatabaseMigrator, ProjectDatabaseMigrator>();
        services.AddTransient<IDatabaseMigrator, TeamDatabaseMigrator>();
        services.AddTransient<IDatabaseMigrator, TaskDatabaseMigrator>();
    }
    
    /// <summary>
    /// Add business application services to the service collection.
    /// </summary>
    /// <param name="services">The current service collection.</param>
    /// <returns>An application builder for changing settings of the application.</returns>
    /// <exception cref="ArgumentNullException">Thrown when the given service collection is null.</exception>
    public static ApplicationBuilder AddApplicationServices(this IServiceCollection services)
    {
        // Services guard
        ArgumentNullException.ThrowIfNull(services);

        // Add application services
        services.AddTransient<IUserService, UserService>();
        services.AddTransient<IProjectService, ProjectService>();
        services.AddTransient<ICategoryService, CategoryService>();
        services.AddTransient<ITaskService, TaskService>();
        services.AddTransient<ICommentService, CommentService>();
        services.AddTransient<ITeamService, TeamService>();
        
        // Add authentication service
        services.AddTransient<IAuthenticationService, AuthenticationService>();

        return new ApplicationBuilder(services);
    }

    /// <summary>
    /// Add business application services to the service collection.
    /// </summary>
    /// <param name="services">The current service collection.</param>
    /// <param name="action">The action which will configure the <see cref="ApplicationServiceOptions"/> of the application.</param>
    /// <returns>An application builder for changing settings of the application.</returns>
    public static ApplicationBuilder AddApplicationServices(this IServiceCollection services,
        Action<ApplicationServiceOptions> action)
    {
        // Services guard
        ArgumentNullException.ThrowIfNull(services);
        
        // Settings action guard
        ArgumentNullException.ThrowIfNull(action);

        // Add default services add configure settings by given action.
        var builder = AddApplicationServices(services);
        services.Configure(action);
        return builder;
    }
}