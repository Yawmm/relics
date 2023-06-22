namespace Backend.Models.Users;

/// <summary>
/// An object class representing a member in the application.
/// </summary>
public class Member
{
    /// <summary>
    /// The reference id to a <see cref="User"/>.
    /// </summary>
    public Guid UserId { get; set; }
    
    /// <summary>
    /// The username of the user.
    /// </summary>
    public string Username { get; set; }
    
    /// <summary>
    /// The email adress of the user.
    /// </summary>
    public string Email { get; set; }

    public Member(User user)
    {
        UserId = user.Id;
        Username = user.Username;
        Email = user.Email;
    }
}