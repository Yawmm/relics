using Backend.Graph.Mutations;
using Backend.Graph.Notifications;
using Backend.Graph.Queries;
using HotChocolate.Execution.Configuration;

namespace Backend.Graph;

/// <summary>
/// An extension class used to clean up the settings in the main program file.
/// </summary>
public static class GraphServiceCollection
{
    /// <summary>
    /// Add the range of available query types to the builder.
    /// </summary>
    /// <param name="builder">The current hot chocolate <see cref="IRequestExecutorBuilder"/>.</param>
    /// <returns>The same <see cref="IRequestExecutorBuilder"/> with the added type extensions.</returns>
    public static IRequestExecutorBuilder AddQueries(this IRequestExecutorBuilder builder)
    {
        builder.AddQueryType<Query>()
            .AddTypeExtension<UserQuery>()
            .AddTypeExtension<ProjectQuery>()
            .AddTypeExtension<TeamQuery>()
            .AddTypeExtension<TaskQuery>();

        return builder;
    }
    
    /// <summary>
    /// Add the range of available mutation types to the builder.
    /// </summary>
    /// <param name="builder">The current hot chocolate <see cref="IRequestExecutorBuilder"/>.</param>
    /// <returns>The same <see cref="IRequestExecutorBuilder"/> with the added type extensions.</returns>
    public static IRequestExecutorBuilder AddMutations(this IRequestExecutorBuilder builder)
    {
        builder.AddMutationType<Mutation>()
            .AddTypeExtension<UserMutation>()
            .AddTypeExtension<ProjectMutation>()
            .AddTypeExtension<TagMutation>()
            .AddTypeExtension<CategoryMutation>()
            .AddTypeExtension<TeamMutation>()
            .AddTypeExtension<TaskMutation>();
        
        return builder;
    }
    
    /// <summary>
    /// Add the range of available subscription types to the builder.
    /// </summary>
    /// <param name="builder">The current hot chocolate <see cref="IRequestExecutorBuilder"/>.</param>
    /// <returns>The same <see cref="IRequestExecutorBuilder"/> with the added type extensions.</returns>
    public static IRequestExecutorBuilder AddSubscriptions(this IRequestExecutorBuilder builder)
    {
        builder.AddSubscriptionType<Subscription>()
            .AddTypeExtension<TaskSubscription>()
            .AddTypeExtension<TeamSubscription>()
            .AddTypeExtension<ProjectSubscription>();

        builder.AddInMemorySubscriptions();
        
        return builder;
    }
}