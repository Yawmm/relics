using Backend.Models.Users;

namespace Backend.Models.Teams;

/// <summary>
/// An object representing a link between a <see cref="Projects.Project"/> and a <see cref="Teams.Team"/> in the application.
/// </summary>
public class Link
{
    /// <summary>
    /// The unique id of the team.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// The name of the team.
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// The owner of the team.
    /// </summary>
    public Member Owner { get; set; } = null!;
    
    /// <summary>
    /// The range of members in the team.
    /// </summary>
    public List<Member> Members { get; set; } = new();
}