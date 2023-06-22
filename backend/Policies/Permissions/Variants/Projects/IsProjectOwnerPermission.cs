namespace Backend.Policies.Permissions.Variants.Projects;

/// <summary>
/// Whether or not the user is the owner of the project in the graph request.
/// </summary>
/// <param name="Identifier">The identifier of the parameters in the graph request.</param>
public record IsProjectOwnerPermission(string Identifier = "project") : IPermission;