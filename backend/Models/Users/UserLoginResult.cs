namespace Backend.Models.Users;

/// <summary>
/// A result class used to show the authentication results of the user.
/// </summary>
/// <param name="jwt">The generated access token of the authenticated user.</param>
public record UserLoginResult(string jwt);
