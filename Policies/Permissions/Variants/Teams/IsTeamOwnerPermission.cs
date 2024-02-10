namespace Backend.Policies.Permissions.Variants.Teams;

/// <summary>
/// Whether or not the user is the owner of the team in the graph request.
/// </summary>
/// <param name="Identifier">The identifier of the parameters in the graph request.</param>
public record IsTeamOwnerPermission(string Identifier = "team") : IPermission;