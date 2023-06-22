namespace Backend.Models.Projects;

/// <summary>
/// A configuration class used to define the things which are required for creating a project.
/// </summary>
/// <param name="Name">The name of the project</param>
/// <param name="OwnerId">The id of the user who is creating the project.</param>
public record ProjectCreateConfiguration(string Name, Guid OwnerId)
{
    /// <summary>
    /// The description of the project.
    /// </summary>
    public string? Description { get; init; }
}