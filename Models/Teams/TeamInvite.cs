namespace Backend.Models.Teams;

/// <summary>
/// An object representing an invite to a team in the application.
/// </summary>
public class TeamInvite
{
    /// <summary>
    /// The unique id of the team.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// The name of the team.
    /// </summary>
    public string Name { get; set; } = null!;
}