using Backend.Policies.Permissions;
using Backend.Policies.Permissions.Handlers.Categories;
using Backend.Policies.Permissions.Handlers.Projects;
using Backend.Policies.Permissions.Handlers.Tags;
using Backend.Policies.Permissions.Handlers.Tasks;
using Backend.Policies.Permissions.Handlers.Teams;
using Backend.Policies.Permissions.Handlers.Users;
using Backend.Policies.Permissions.Variants.Categories;
using Backend.Policies.Permissions.Variants.Projects;
using Backend.Policies.Permissions.Variants.Tags;
using Backend.Policies.Permissions.Variants.Tasks;
using Backend.Policies.Permissions.Variants.Teams;
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
        services.AddTransient<IPermissionHandler<IsProjectDirectMemberPermission>, IsProjectDirectMemberPermissionHandler>();
        services.AddTransient<IPermissionHandler<IsProjectIndirectMemberPermission>, IsProjectIndirectMemberPermissionHandler>();
        services.AddTransient<IPermissionHandler<IsProjectMemberPermission>, IsProjectMemberPermissionHandler>();
        services.AddTransient<IPermissionHandler<IsProjectOwnerPermission>, IsProjectOwnerPermissionHandler>();
        
        // Team handlers
        services.AddTransient<IPermissionHandler<IsTeamMemberPermission>, IsTeamMemberPermissionHandler>();
        services.AddTransient<IPermissionHandler<IsTeamOwnerPermission>, IsTeamOwnerPermissionHandler>();
        
        // Category handlers
        services.AddTransient<IPermissionHandler<IsCategoryProjectOwnerPermission>, IsCategoryProjectOwnerPermissionHandler>();
        
        // Tag handlers
        services.AddTransient<IPermissionHandler<IsTagProjectMemberPermission>, IsTagProjectMemberPermissionHandler>();
        
        // Task handlers
        services.AddTransient<IPermissionHandler<IsTaskProjectMemberPermission>, IsTaskProjectMemberPermissionHandler>();
        services.AddTransient<IPermissionHandler<IsTaskOwnerPermission>, IsTaskOwnerPermissionHandler>();
        services.AddTransient<IPermissionHandler<IsCommentOwnerPermission>, IsCommentOwnerPermissionHandler>();
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
        
        options.AddPolicy(PolicyTypes.LeaveProject, policy => policy.Requirements.Add(new IsProjectDirectMemberPermission()));
        options.AddPolicy(PolicyTypes.KickProjectMember, policy =>
        {
            policy.Requirements.Add(new IsProjectDirectMemberPermission());
            policy.Requirements.Add(new IsProjectOwnerPermission());
        });
        
        // Team policies
        options.AddPolicy(PolicyTypes.ReadTeam, policy => policy.Requirements.Add(new IsTeamMemberPermission()));
        options.AddPolicy(PolicyTypes.ReadTeams, policy => policy.Requirements.Add(new IsUserPermission()));
        options.AddPolicy(PolicyTypes.WriteTeam, policy => policy.Requirements.Add(new IsTeamMemberPermission()));
        options.AddPolicy(PolicyTypes.DeleteTeam, policy => policy.Requirements.Add(new IsTeamOwnerPermission()));
        
        options.AddPolicy(PolicyTypes.LeaveTeam, policy => policy.Requirements.Add(new IsTeamMemberPermission()));
        options.AddPolicy(PolicyTypes.KickTeamMember, policy =>policy.Requirements.Add(new IsTeamOwnerPermission()));
        
        // Member policies
        options.AddPolicy(PolicyTypes.InviteMemberResponse, policy => policy.Requirements.Add(new IsUserPermission()));

        // Category policies
        options.AddPolicy(PolicyTypes.DeleteCategory, policy => policy.Requirements.Add(new IsCategoryProjectOwnerPermission()));

        // Tag policies
        options.AddPolicy(PolicyTypes.WriteTag, policy => policy.Requirements.Add(new IsTagProjectMemberPermission()));
        options.AddPolicy(PolicyTypes.DeleteTag, policy => policy.Requirements.Add(new IsTagProjectMemberPermission()));

        // Task policies
        options.AddPolicy(PolicyTypes.ReadTasks, policy => policy.Requirements.Add(new IsUserPermission()));
        options.AddPolicy(PolicyTypes.WriteTask, policy => policy.Requirements.Add(new IsTaskProjectMemberPermission()));
        options.AddPolicy(PolicyTypes.DeleteTask, policy => policy.Requirements.Add(new IsTaskOwnerPermission()));
        options.AddPolicy(PolicyTypes.DeleteComment, policy => policy.Requirements.Add(new IsCommentOwnerPermission()));
    }
}