namespace Backend.Errors;

/// <summary>
/// Exception for errors which occurred during the registration of a new user.
/// </summary>
public class UserRegisterError : Exception
{
    public UserRegisterError(string message) : 
        base($"Unable to register new user because {message.ToLower()}")
    { }
}