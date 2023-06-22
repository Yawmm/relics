namespace Backend.Policies.Permissions.Variants.Categories;

/// <summary>
/// Whether or not the owner of the category in the graph request is a member of the project which the category is in.
/// </summary>
/// <param name="Identifier">The identifier of the parameters in the graph request.</param>
public record IsCategoryProjectOwnerPermission(string Identifier = "category") : IPermission;