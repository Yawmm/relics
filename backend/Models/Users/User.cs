using HotChocolate.Authorization;

namespace Backend.Models.Users;

/// <summary>
/// An object class representing the user data model in the application.
/// </summary>
[Authorize]
public class User
{
    /// <summary>
    /// The unique id of the user.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// The username of the user.
    /// </summary>
    public string Username { get; set; } = null!;
    
    /// <summary>
    /// The email adress of the user.
    /// </summary>
    public string Email { get; set; } = null!;
    
    /// <summary>
    /// The hashed password of the user, with salt prepended.
    /// </summary>
    [GraphQLIgnore]
    public string? Hash { get; set; }
}