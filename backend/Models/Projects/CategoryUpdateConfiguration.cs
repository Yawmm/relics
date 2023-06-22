namespace Backend.Models.Projects;

/// <summary>
/// Configuration class used to define the things which can be changed in a <see cref="Category"/>.
/// </summary>
public class CategoryUpdateConfiguration
{
    /// <summary>
    /// The new name of the category.
    /// </summary>
    public string? Name { get; }

    public CategoryUpdateConfiguration(string? name = null)
    {
        Name = name;
    }
};
