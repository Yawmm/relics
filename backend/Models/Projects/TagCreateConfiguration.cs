
namespace Backend.Models.Projects;

/// <summary>
/// A configuration class used to define the things which are required for creating a tag.
/// </summary>
/// <param name="Name">The name of the tag.</param>
/// <param name="Color">The color of the tag.</param>
/// <param name="ProjectId">The id of the parent project of the tag.</param>
public record TagCreateConfiguration(string Name, string Color, Guid ProjectId);
