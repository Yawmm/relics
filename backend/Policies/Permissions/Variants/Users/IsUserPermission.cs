namespace Backend.Policies.Permissions.Variants.Users;

/// <summary>
/// Whether or not the autheticated user is equal to the user in the request.
/// </summary>
/// <param name="Identifier">The identifier of the parameters in the graph request.</param>
public record IsUserPermission(string Identifier = "user") : IPermission;