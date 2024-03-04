namespace Backend.Models.Projects;

/// <summary>
/// Configuration class used to define the things which can be changed in a <see cref="Tag"/>.
/// </summary>
public class TagUpdateConfiguration
{
    /// <summary>
    /// The new name of the tag.
    /// </summary>
    public string? Name { get; }
    
    /// <summary>
    /// The new color of the tag.
    /// </summary>
    public string? Color { get; }
    
    /// <summary>
    /// The range of changes to the labels of the project.
    /// </summary>
    public List<LabelChange>? Labels { get; init; }

    public TagUpdateConfiguration(
        string? name = null, 
        string? color = null,
        List<LabelChange>? labels = default)
    {
        Name = name;
        Color = color;
        Labels = labels;
    }
};
