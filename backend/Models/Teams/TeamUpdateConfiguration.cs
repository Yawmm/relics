using Backend.Models.Users;

namespace Backend.Models.Teams;

/// <summary>
/// Configuration class used to define the things which can be changed in a <see cref="Team"/>.
/// </summary>
public class TeamUpdateConfiguration
{
    /// <summary>
    /// The new name of the team.
    /// </summary>
    public string? Name { get; }
    
    /// <summary>
    /// The id of the new owner of the team.
    /// </summary>
    public Guid? OwnerId { get; }

    /// <summary>
    /// The range of changes to the members of the team.
    /// </summary>
    public List<MemberChange>? Members { get; init; }

    /// <summary>
    /// The range of changes to the invites of the team.
    /// </summary>
    public List<InviteChange>? Invites { get; init; }
    
    public TeamUpdateConfiguration(
        string? name = null, 
        Guid? ownerId = null, 
        List<MemberChange>? members = default,
        List<InviteChange>? invites = default)
    {
        Name = name;

        OwnerId = ownerId;
        
        Members = members;
        Invites = invites;
    }
}