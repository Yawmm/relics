using Microsoft.AspNetCore.Authorization;

namespace Backend.Policies.Permissions;

/// <summary>
/// An interface used to define a specific hot chocolate permission, for the authorization step.
/// </summary>
public interface IPermission : IAuthorizationRequirement { }