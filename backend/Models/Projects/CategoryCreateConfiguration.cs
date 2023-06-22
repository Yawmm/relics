namespace Backend.Models.Projects;

/// <summary>
/// A configuration class used to define the things which are required for creating a category.
/// </summary>
/// <param name="Name">The name of the category.</param>
/// <param name="ProjectId">The id of the parent project of the category.</param>
public record CategoryCreateConfiguration(string Name, Guid ProjectId);
