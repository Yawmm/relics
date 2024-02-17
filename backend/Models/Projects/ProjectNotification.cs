using Backend.Models.General;

namespace Backend.Models.Projects;

/// <summary>
/// A configuration class used to define the changes of a <see cref="Projects.Project"/>.
/// </summary>
/// <param name="Type">Whether the project should be added or removed from the object.</param>
/// <param name="Project">The project which was changed.</param>
public record ProjectNotification(NotificationType Type, Project? Project);