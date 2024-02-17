using Backend.Models.General;

namespace Backend.Models.Projects;

/// <summary>
/// A configuration class used to define the changes of a <see cref="ProjectInvite"/>.
/// </summary>
/// <param name="Type">Whether the project invite should be added or removed from the object.</param>
/// <param name="ProjectInvite">The project invite which was changed.</param>
public record ProjectInviteNotification(NotificationType Type, ProjectInvite? ProjectInvite);