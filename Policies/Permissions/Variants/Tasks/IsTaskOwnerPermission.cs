namespace Backend.Policies.Permissions.Variants.Tasks;

/// <summary>
/// Whether or not the user is the owner of the task in the graph request.
/// </summary>
/// <param name="Identifier">The identifier of the parameters in the graph request.</param>
public record IsTaskOwnerPermission(string Identifier = "task") : IPermission;