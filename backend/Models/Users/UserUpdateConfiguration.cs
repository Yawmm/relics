namespace Backend.Models.Users;

/// <summary>
/// Configuration class used to define the things which can be changed in a <see cref="User"/>.
/// </summary>
public class UserUpdateConfiguration
{
    /// <summary>
    /// The new username of the <see cref="User"/>.
    /// </summary>
    public string? Username { get; }

    public UserUpdateConfiguration(string? username)
        => Username = username;
}