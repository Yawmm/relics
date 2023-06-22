using Backend.Policies.Permissions;
using Backend.Policies.Permissions.Handlers.Categories;
using Backend.Policies.Permissions.Handlers.Projects;
using Backend.Policies.Permissions.Handlers.Tasks;
using Backend.Policies.Permissions.Handlers.Users;
using Backend.Policies.Permissions.Variants.Categories;
using Backend.Policies.Permissions.Variants.Projects;
using Backend.Policies.Permissions.Variants.Tasks;
using Backend.Policies.Permissions.Variants.Users;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Policies;

/// <summary>
/// An extension class used to extend the service collection with policy methods.
/// </summary>
public static class PolicyServiceCollection
{
    /// <summary>
    /// Add the required range of <see cref="IPermissionHandler{T}"/>.
    /// </summary>
    /// <param name="services">The services of the current application.</param>
    /// <exception cref="ArgumentNullException">Thrown when the <see cref="IServiceCollection"/> is null.</exception>
    public static void AddPolicyHandlers(this IServiceCollection services)
    {
        // Service collection guard
        ArgumentNullException.ThrowIfNull(services);

        // General handler
        services.AddTransient<IAuthorizationHandler, PermissionsHandler>();

        // User handlers
        services.AddTransient<IPermissionHandler<IsUserPermission>, IsUserPermissionHandler>();
        
        // Project handlers
        services.AddTransient<IPermissionHandler<IsProjectMemberPermission>, IsProjectMemberPremissionHandler>();
        services.AddTransient<IPermissionHandler<IsProjectOwnerPermission>, IsProjectOwnerPermissionHandler>();
        
        // Category handlers
        services.AddTransient<IPermissionHandler<IsCategoryProjectOwnerPermission>, IsCategoryProjectOwnerPermissionHandler>();
        
        // Task handlers
        services.AddTransient<IPermissionHandler<IsTaskProjectMemberPermission>, IsTaskProjectMemberPermissionHandler>();
        services.AddTransient<IPermissionHandler<IsTaskOwnerPermission>, IsTaskOwnerPermissionHandler>();
    }

    /// <summary>
    /// Add the range of policies found in the <see cref="PolicyTypes"/>.
    /// </summary>
    /// <param name="options">The available <see cref="AuthorizationOptions"/> to the application.</param>
    public static void AddPolicies(this AuthorizationOptions options)
    {
        // User policies
        options.AddPolicy(PolicyTypes.WriteUserProfile, policy => policy.Requirements.Add(new IsUserPermission()));
        options.AddPolicy(PolicyTypes.DeleteUserProfile, policy => policy.Requirements.Add(new IsUserPermission()));
        options.AddPolicy(PolicyTypes.ReadInvites, policy => policy.Requirements.Add(new IsUserPermission()));
  
        // Project policies
        options.AddPolicy(PolicyTypes.ReadProject, policy => policy.Requirements.Add(new IsProjectMemberPermission()));
        options.AddPolicy(PolicyTypes.ReadProjects, policy => policy.Requirements.Add(new IsUserPermission()));
        options.AddPolicy(PolicyTypes.WriteProject, policy => policy.Requirements.Add(new IsProjectMemberPermission()));
        options.AddPolicy(PolicyTypes.DeleteProject, policy => policy.Requirements.Add(new IsProjectOwnerPermission()));
        options.AddPolicy(PolicyTypes.LeaveProject, policy => policy.Requirements.Add(new IsProjectMemberPermission()));
        options.AddPolicy(PolicyTypes.InviteMember, policy => policy.Requirements.Add(new IsProjectOwnerPermission()));
        options.AddPolicy(PolicyTypes.InviteMemberResponse, policy => policy.Requirements.Add(new IsUserPermission()));
        options.AddPolicy(PolicyTypes.KickMember, policy =>
        {
            policy.Requirements.Add(new IsProjectMemberPermission());
            policy.Requirements.Add(new IsProjectOwnerPermission());
        });

        // Category policies
        options.AddPolicy(PolicyTypes.DeleteCategory, policy => policy.Requirements.Add(new IsCategoryProjectOwnerPermission()));

        // Task policies
        options.AddPolicy(PolicyTypes.ReadTasks, policy => policy.Requirements.Add(new IsUserPermission()));
        options.AddPolicy(PolicyTypes.WriteTask, policy => policy.Requirements.Add(new IsTaskProjectMemberPermission()));
        options.AddPolicy(PolicyTypes.DeleteTask, policy => policy.Requirements.Add(new IsTaskOwnerPermission()));
    }
}