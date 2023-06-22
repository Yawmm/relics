using Backend.Models.Users;

namespace Backend.Models.Projects;

/// <summary>
/// Configuration class used to define the things which can be changed in a <see cref="Project"/>.
/// </summary>
public class ProjectUpdateConfiguration
{
    /// <summary>
    /// The new name of the project.
    /// </summary>
    public string? Name { get; }
    
    /// <summary>
    /// The new description of the project.
    /// </summary>
    public string? Description { get; }
    
    /// <summary>
    /// The id of the new owner of the project.
    /// </summary>
    public Guid? OwnerId { get; }

    /// <summary>
    /// The range of changes to the members of the project.
    /// </summary>
    public List<MemberChange>? Members { get; init; }

    /// <summary>
    /// The range of changes to the invites of the project.
    /// </summary>
    public List<InviteChange>? Invites { get; init; }
    
    public ProjectUpdateConfiguration(
        string? name = null, 
        string? description = null, 
        Guid? ownerId = null, 
        List<MemberChange>? members = default,
        List<InviteChange>? invites = default)
    {
        Name = name;
        Description = description;

        OwnerId = ownerId;
        
        Members = members;
        Invites = invites;
    }
}