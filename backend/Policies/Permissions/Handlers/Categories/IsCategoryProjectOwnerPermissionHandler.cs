using System.Security.Claims;
using Backend.Core.Services.Projects;
using Backend.Policies.Permissions.Extensions;
using Backend.Policies.Permissions.Variants.Categories;
using HotChocolate.Resolvers;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Policies.Permissions.Handlers.Categories;

/// <inheritdoc cref="IPermissionHandler{T}"/>
public class IsCategoryProjectOwnerPermissionHandler : IPermissionHandler<IsCategoryProjectOwnerPermission>
{
    private readonly IProjectService _projectService;

    public IsCategoryProjectOwnerPermissionHandler(IProjectService projectService)
    {
        _projectService = projectService;
    }

    /// <inheritdoc cref="IPermissionHandler{T}.Handle"/>
    public void Handle(IsCategoryProjectOwnerPermission permission, IMiddlewareContext middleware,
        AuthorizationHandlerContext context)
    {
        // Retrieve the id of the authenticated user
        var idClaim = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (idClaim is null || !Guid.TryParse(idClaim.Value, out var userId))
            return;
        
        // Retrieve the id of the category
        if (!middleware.GetValue<Guid>(permission.Identifier, out var categoryId) || !categoryId.HasValue)
            return;
        
        // Find the parent project of the category
        var projectId = _projectService.Identify(category: categoryId);
        if (projectId is null)
            return;

        // Retrieve the project
        var project = _projectService.Get((Guid)projectId);
        
        // Check if the authenticated user is the owner of the project
        if (project.Owner.UserId != userId)
            return;
        
        context.Succeed(permission);
    }
}