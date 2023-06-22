using System.Security.Claims;
using Backend.Core.Services.Projects;
using Backend.Policies.Permissions.Extensions;
using Backend.Policies.Permissions.Variants.Tasks;
using HotChocolate.Resolvers;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Policies.Permissions.Handlers.Tasks;

/// <inheritdoc cref="IPermissionHandler{T}"/>
public class IsTaskProjectMemberPermissionHandler : IPermissionHandler<IsTaskProjectMemberPermission>
{
    private readonly IProjectService _projectService;
    
    public IsTaskProjectMemberPermissionHandler(IProjectService projectService)
    {
        _projectService = projectService;
    }
    
    /// <inheritdoc cref="IPermissionHandler{T}.Handle"/>
    public void Handle(IsTaskProjectMemberPermission permission, IMiddlewareContext middleware, AuthorizationHandlerContext context)
    {
        // Retrieve the id of the authenticated user
        var idClaim = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (idClaim is null || !Guid.TryParse(idClaim.Value, out var userId))
            return;

        // Retrieve id of the task
        if (!middleware.GetValue<Guid>(permission.Identifier, out var taskId) || !taskId.HasValue)
            return;
        
        // Find the parent project of the task
        var projectId = _projectService.Identify(task: taskId);
        if (projectId is null)
            return;

        // Retrieve the parent project of the task
        var project = _projectService.Get((Guid)projectId);

        // Check if the authenticated user is a member of the found project
        if (project.Members.All(m => m.UserId != userId))
            return;
        
        context.Succeed(permission);
    }
}