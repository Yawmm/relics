namespace Backend.Models.Users;

/// <summary>
/// A configuration class used to define the things which are required for creating a new user.
/// </summary>
/// <param name="Username">The username of the user.</param>
/// <param name="Email">The email adress of the user.</param>
public record UserCreateConfiguration(string Username, string Email)
{
    /// <summary>
    /// The hashed password of the user, with salt prepended.
    /// </summary>
    public string? Hash { get; }

    public UserCreateConfiguration(
        string username, 
        string email, 
        string hash) 
        : this(username, email)
    {
        Hash = hash;
    }
}