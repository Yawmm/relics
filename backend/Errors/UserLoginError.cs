namespace Backend.Errors;

/// <summary>
/// Exception for errors which occurred during the login of an existing user.
/// </summary>
public class UserLoginError : Exception
{
    public UserLoginError(string message) : 
        base($"Unable to log in user because {message.ToLower()}")
    { }
}