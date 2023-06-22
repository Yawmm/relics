using Backend.Models.General;

namespace Backend.Models.Users;

/// <summary>
/// A configuration class used to define the changes of a <see cref="Users.Member"/> in a <see cref="Projects.Project"/>.
/// </summary>
/// <param name="Type">Whether the member should be added or removed from the <see cref="Projects.Project"/>.</param>
/// <param name="Member">The id of the member.</param>
public record MemberChange(ChangeType Type, Guid Member);
