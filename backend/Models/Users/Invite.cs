namespace Backend.Models.Users;

/// <summary>
/// An object class representing an invite to a <see cref="Projects.Project"/> in the application.
/// </summary>
public class Invite
{
    /// <summary>
    /// The reference id to the <see cref="User"/>.
    /// </summary>
    public Guid UserId { get; }
    
    /// <summary>
    /// The username of the user.
    /// </summary>
    public string Username { get; set; }
    
    /// <summary>
    /// The email adress of the user.
    /// </summary>
    public string Email { get; }

    public Invite(User user)
    {
        UserId = user.Id;
        Username = user.Username;
        Email = user.Email;
    }
}