using Backend.Models.General;

namespace Backend.Models.Users;

/// <summary>
/// A configuration class used to define the changes of a <see cref="Users.Invite"/> in a <see cref="Projects.Project"/>.
/// </summary>
/// <param name="Type">Whether the invite should be added or removed from the <see cref="Projects.Project"/>.</param>
/// <param name="User">The id of the user.</param>
public record InviteChange(ChangeType Type, Guid User);
