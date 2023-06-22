using System.Security.Claims;
using Backend.Core.Services.Tasks;
using Backend.Policies.Permissions.Extensions;
using Backend.Policies.Permissions.Variants.Tasks;
using HotChocolate.Resolvers;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Policies.Permissions.Handlers.Tasks;

/// <inheritdoc cref="IPermissionHandler{T}"/>
public class IsTaskOwnerPermissionHandler : IPermissionHandler<IsTaskOwnerPermission>
{
    private readonly ITaskService _taskService;
    
    public IsTaskOwnerPermissionHandler(ITaskService taskService)
    {
        _taskService = taskService;
    }
    
    /// <inheritdoc cref="IPermissionHandler{T}.Handle"/>
    public void Handle(IsTaskOwnerPermission permission, IMiddlewareContext middleware, AuthorizationHandlerContext context)
    {
        // Retrieve the id of the authenticated user
        var claim = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (claim is null || !Guid.TryParse(claim.Value, out var ownerId))
            return;

        // Retrieve the id of the task
        if (!middleware.GetValue<Guid>(permission.Identifier, out var taskId) || !taskId.HasValue)
            return;

        // Retrieve the task
        var task = _taskService.Get(taskId);
        
        // Check if the authenticated user is the owner of the task
        if (task.Owner.UserId != ownerId)
            return;
        
        context.Succeed(permission);
    }
}