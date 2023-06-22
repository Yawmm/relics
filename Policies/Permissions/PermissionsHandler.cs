using HotChocolate.Resolvers;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Policies.Permissions;

/// <summary>
/// An <see cref="IAuthorizationHandler"/> used to manage the range of available <see cref="IPermission"/> in the application.
/// </summary>
public class PermissionsHandler : IAuthorizationHandler
{
    /// <inheritdoc cref="HandleAsync"/>
    public Task HandleAsync(AuthorizationHandlerContext context)
    {
        // Check if the context is a hot chocolate middleware context, required for the permissions
        // since they are meant for the hot chocolate framework.
        if (context.Resource is not IMiddlewareContext middlewareContext)
            return Task.CompletedTask;
        
        // Handle all the pending permissions.
        foreach (var requirement in context.PendingRequirements)
        {
            if (requirement is IPermission permission)
                Handle(permission, middlewareContext, context);
        }
        
        return Task.CompletedTask;
    }
    
    /// <summary>
    /// Handle a <see cref="IPermission"/> by finding the matching <see cref="IPermissionHandler{T}"/> in the application via reflection.
    /// </summary>
    /// <param name="requirement">The permission which should be handled.</param>
    /// <param name="middleware">The context of the current graph request.</param>
    /// <param name="context">The context of the current authorization step.</param>
    private void Handle(IPermission requirement, IMiddlewareContext middleware, AuthorizationHandlerContext context)
    {
        // Create the required permission handler generic type.
        var generic = typeof(IPermissionHandler<>);
        var type = requirement.GetType();
        var args = generic.MakeGenericType(type);
        
        // Retrieve the service of the created generic type from the service collection.
        var handler = middleware.Services.GetService(args);
        if (handler is null) return;
            
        // Should be the name of the method of the generic IPermissionHandler interface,
        // but using nameof(IPermissionHandler<>.Handle) won't work so we have to hard-code it in. 
        var method = handler.GetType().GetMethod("Handle");
        if (method is null) return;
        
        // Invoke the found handle method on the permission handler.
        method.Invoke(handler, new object[] { requirement, middleware, context });
    }
}