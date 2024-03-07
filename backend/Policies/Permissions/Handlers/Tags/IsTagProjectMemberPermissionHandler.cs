using System.Security.Claims;
using Backend.Core.Services.Projects;
using Backend.Policies.Permissions.Extensions;
using Backend.Policies.Permissions.Variants.Tags;
using HotChocolate.Resolvers;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Policies.Permissions.Handlers.Tags;

/// <inheritdoc cref="IPermissionHandler{T}"/>
public class IsTagProjectMemberPermissionHandler : IPermissionHandler<IsTagProjectMemberPermission>
{
    private readonly IProjectService _projectService;

    public IsTagProjectMemberPermissionHandler(IProjectService projectService)
    {
        _projectService = projectService;
    }

    /// <inheritdoc cref="IPermissionHandler{T}.Handle"/>
    public void Handle(IsTagProjectMemberPermission permission, IMiddlewareContext middleware,
        AuthorizationHandlerContext context)
    {
        // Retrieve the id of the authenticated user
        var idClaim = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (idClaim is null || !Guid.TryParse(idClaim.Value, out var userId))
            return;
        
        // Retrieve the id of the tag
        if (!middleware.GetValue<Guid>(permission.Identifier, out var tagId) || !tagId.HasValue)
            return;
        
        // Find the parent project of the tag
        var projectId = _projectService.Identify(tag: tagId);
        if (projectId is null)
            return;

        // Retrieve the project
        var project = _projectService.Get((Guid)projectId);
        
        // Check if the authenticated user is the owner of the project
        if (project.Members.All(m => m.UserId != userId))
            return;
        
        context.Succeed(permission);
    }
}