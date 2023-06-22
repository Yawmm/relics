using System.Security.Claims;
using Backend.Policies.Permissions.Extensions;
using Backend.Policies.Permissions.Variants.Users;
using HotChocolate.Resolvers;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Policies.Permissions.Handlers.Users;

/// <inheritdoc cref="IPermissionHandler{T}"/>
public class IsUserPermissionHandler : IPermissionHandler<IsUserPermission>
{
    /// <inheritdoc cref="IPermissionHandler{T}.Handle"/>
    public void Handle(IsUserPermission permission, IMiddlewareContext middleware, AuthorizationHandlerContext context)
    {
        // Retrieve the id of the user
        if (!middleware.GetValue<Guid>(permission.Identifier, out var id))
            return;

        // Check if the id of the user in the request parameters is equal to the id of
        // the authenticated user.
        if (!context.User.HasClaim(ClaimTypes.NameIdentifier, id.ToString()))
            return;
        
        context.Succeed(permission);
    }
}