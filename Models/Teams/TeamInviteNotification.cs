using Backend.Models.General;

namespace Backend.Models.Teams;

/// <summary>
/// A configuration class used to define the changes of a <see cref="TeamInvite"/>.
/// </summary>
/// <param name="Type">Whether the team invite should be added or removed from the object.</param>
/// <param name="TeamInvite">The team invite which was changed.</param>
public record TeamInviteNotification(NotificationType Type, TeamInvite? TeamInvite);