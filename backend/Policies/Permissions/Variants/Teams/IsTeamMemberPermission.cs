namespace Backend.Policies.Permissions.Variants.Teams;

/// <summary>
/// Whether or not the user is a member of the team, or one of the links of the team, in the graph request.
/// </summary>
/// <param name="Identifier">The identifier of the parameters in the graph request.</param>
public record IsTeamMemberPermission(string Identifier = "team") : IPermission;