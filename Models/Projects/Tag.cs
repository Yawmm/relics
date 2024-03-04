namespace Backend.Models.Projects;

/// <summary>
/// An object class used to represent the tag data model in the application.
/// </summary>
public class Tag
{
    /// <summary>
    /// The unique id of the tag.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// The name of the tag.
    /// </summary>
    public string Name { get; set; } = null!;
    
    /// <summary>
    /// The color of the tag.
    /// </summary>
    public string Color { get; set; }
}