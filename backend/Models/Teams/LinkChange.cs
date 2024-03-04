using Backend.Models.General;

namespace Backend.Models.Teams;

/// <summary>
/// A configuration class used to define the changes of a <see cref="Teams.Link"/> in a <see cref="Projects.Project"/>.
/// </summary>
/// <param name="Type">Whether the link should be added or removed from the object.</param>
/// <param name="Team">The id of the team.</param>
public record LinkChange(ChangeType Type, Guid Team);