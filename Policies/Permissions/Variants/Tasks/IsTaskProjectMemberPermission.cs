namespace Backend.Policies.Permissions.Variants.Tasks;

/// <summary>
/// Whether or not the owner of the task in the graph request is a member of the project which the task is in.
/// </summary>
/// <param name="Identifier">The identifier of the parameters in the graph request.</param>
public record IsTaskProjectMemberPermission(string Identifier = "task") : IPermission;