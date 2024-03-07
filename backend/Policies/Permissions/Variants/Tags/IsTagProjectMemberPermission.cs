namespace Backend.Policies.Permissions.Variants.Tags;

/// <summary>
/// Whether or not the owner of the tag in the graph request is a member of the project which the tag is in.
/// </summary>
/// <param name="Identifier">The identifier of the parameters in the graph request.</param>
public record IsTagProjectMemberPermission(string Identifier = "tag") : IPermission;