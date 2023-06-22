using Backend.Core.Services.Authentication;
using Backend.Core.Services.Users;
using Backend.Errors;
using Backend.Models.General;
using Backend.Models.Users;
using Backend.Policies;
using HotChocolate.Authorization;

namespace Backend.Graph.Mutations;

/// <summary>
/// Extension of <see cref="Mutation"/> which contains all the mutations relating to the <see cref="User"/> object.
/// </summary>
[ExtendObjectType<Mutation>]
public class UserMutation
{
    /// <summary>
    /// Login a user by challenging their password with the stored hash.
    /// </summary>
    /// <param name="authenticationService">The current authentication service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="email">The email adress of the user.</param>
    /// <param name="password">The password which should be challenged of the user.</param>
    /// <returns>Either a JWT token if the challenge was succesful, or an error if it wasn't.</returns>
    /// <exception cref="UserLoginError">Thrown when the user didn't beat the challenge.</exception>
    [Error<ItemNotFoundError>]
    [Error<UserLoginError>]
    public UserLoginResult LoginPasswordUser(
        [Service] IAuthenticationService authenticationService,
        [Service] IUserService userService, 
        string email, 
        string password)
    {
        // Get user by given email
        var user = userService.Get(email);
        if (user.Hash is null)
            throw new UserLoginError("The given user hasn't created a password account.");

        // Challenge the given password
        var match = authenticationService.Challenge(user.Hash, password);
        if (!match)
            throw new UserLoginError("The given password is incorrect.");

        // Return a newly generated access token for the user
        var token = authenticationService.Token(user);
        return new UserLoginResult(token);
    }
    
    /// <summary>
    /// Register a new user in the database.
    /// </summary>
    /// <param name="authenticationService">The current authentication service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="username">The username of the new user.</param>
    /// <param name="email">The email adress of the new user.</param>
    /// <param name="password">
    /// The password of the new user, in plaintext.
    /// Since the request is sent via HTTPS it isn't needed to hash the password before sending the request.
    /// Other applications also just send the password in plaintext because of this.
    /// </param>
    /// <returns>The guid of the newly created user.</returns>
    /// <exception cref="UserRegisterError">Thrown when the user couldn't be created, or if it already existed.</exception>
    [Error<UserRegisterError>]
    public Guid RegisterPasswordUser(
        [Service] IAuthenticationService authenticationService,
        [Service] IUserService userService, 
        string username, 
        string email, 
        string password)
    {
        // Check if the user exists before trying to register a new user to the same email adress
        if (userService.Exists(email))
            throw new UserRegisterError("A user with the given email address already exists, try logging in.");
        
        // Hash the password of the user 
        var hash = authenticationService.Hash(password);
        
        // Create the user in the database
        var guid = userService.Create(new UserCreateConfiguration(username, email, hash));
        
        // User guard
        if (guid is null)
            throw new UserRegisterError("The application was unable to register a new user to the given email address.");

        return (Guid)guid;
    }

    /// <summary>
    /// Update certain elements of the user object in the database.
    /// </summary>
    /// <param name="userService">The current user service.</param>
    /// <param name="user">The guid of the user </param>
    /// <param name="username">The new username of the given user.</param>
    /// <returns>Whether or not the update was successful.</returns>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.WriteUserProfile)]
    public Result UpdateUser(
        [Service] IUserService userService,
        [ID] Guid user,
        string? username)
    {
        // Update the user in the database
        userService.Update(user, new UserUpdateConfiguration(username));
        return new Result(true);
    }

    /// <summary>
    /// Remove a user from the database.
    /// </summary>
    /// <param name="userService">The current user service.</param>
    /// <param name="user">The guid of the user which should be removed.</param>
    /// <returns>Whether or not the remove operation was successful.</returns>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.DeleteUserProfile)]
    public Result RemoveUser(
        [Service] IUserService userService,
        [ID] Guid user)
    {
        // Delete the user from the database
        userService.Delete(user);
        return new Result(true);
    }
}