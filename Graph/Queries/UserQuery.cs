using Backend.Core.Services.Users;
using Backend.Errors;
using Backend.Models.Projects;
using Backend.Models.Teams;
using Backend.Models.Users;
using Backend.Policies;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Graph.Queries;

/// <summary>
/// Extension of <see cref="Query"/> which contains all the queries relating to the <see cref="User"/> object.
/// </summary>
[ExtendObjectType<Query>]
public class UserQuery
{
    /// <summary>
    /// Retrieve a given user.
    /// </summary>
    /// <param name="userService">The current user service.</param>
    /// <param name="user">The target user which should be retrieved.</param>
    /// <returns>The retrieved user.</returns>
    [Error<ItemNotFoundError>]
    public User GetUser(
        [Service] IUserService userService, 
        [ID] Guid user)
        => userService.Get(user);
    
    /// <summary>
    /// Retrieve all the incoming invites a user has to a project.
    /// </summary>
    /// <param name="userService">The current user service.</param>
    /// <param name="user">The target user from which the invites should be retrieved.</param>
    /// <returns>The retrieved range of incoming invites of the given user.</returns>
    [Authorize(Policy = PolicyTypes.ReadInvites)]
    public List<ProjectInvite> GetProjectInvites(
        [Service] IUserService userService, 
        [ID] Guid user)
        => userService.ProjectInvites(user);
    
    /// <summary>
    /// Retrieve all the incoming invites a user has to a project.
    /// </summary>
    /// <param name="userService">The current user service.</param>
    /// <param name="user">The target user from which the invites should be retrieved.</param>
    /// <returns>The retrieved range of incoming invites of the given user.</returns>
    [Authorize(Policy = PolicyTypes.ReadInvites)]
    public List<TeamInvite> GetTeamInvites(
        [Service] IUserService userService, 
        [ID] Guid user)
        => userService.TeamInvites(user);
}