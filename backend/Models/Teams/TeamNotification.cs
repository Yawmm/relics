using Backend.Models.General;

namespace Backend.Models.Teams;

/// <summary>
/// A configuration class used to define the changes of a <see cref="Teams.Team"/>.
/// </summary>
/// <param name="Type">Whether the team should be added or removed from the object.</param>
/// <param name="Team">The team which was changed.</param>
public record TeamNotification(NotificationType Type, Team? Team);