namespace Backend.Models.Projects;

/// <summary>
/// An object class used to represent an invite to a project in the application.
/// </summary>
public class ProjectInvite
{
    /// <summary>
    /// The unique id of the project.
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// The name of the project.
    /// </summary>
    public string Name { get; set; } = null!;
    
    /// <summary>
    /// The description of the project.
    /// </summary>
    public string Description { get; set; } = null!;
}