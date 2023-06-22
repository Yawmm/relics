using HotChocolate.Resolvers;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Policies.Permissions;

/// <summary>
/// An interface used to define a handler for an <see cref="IPermission"/>, which checks if a user is allowed to access a certain
/// resource.
/// </summary>
/// <typeparam name="T">The type of <see cref="IPermission"/>.</typeparam>
public interface IPermissionHandler<in T>
    where T : IPermission
{
    /// <summary>
    /// Handle the authorization requirements for the given permission.
    /// </summary>
    /// <param name="permission">The permission which should be handled.</param>
    /// <param name="middleware">The context of the current graph request.</param>
    /// <param name="context">The context of the current authorization step.</param>
    void Handle(T permission, IMiddlewareContext middleware, AuthorizationHandlerContext context);
}