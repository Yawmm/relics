using Backend.Models.Projects;
using Backend.Models.Users;

namespace Backend.Models.Teams;

/// <summary>
/// An object representing a team in the application.
/// </summary>
public class Team
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
    
    /// <summary>
    /// The range of outgoing invites of the team.
    /// </summary>
    public List<Invite> Invites { get; set; } = new();
    
    /// <summary>
    /// The range of outgoing invites of the team.
    /// </summary>
    public List<Project> Projects { get; set; } = new();
}