using Backend.Core.Services.Teams;
using Backend.Core.Services.Users;
using Backend.Errors;
using Backend.Models.General;
using Backend.Models.Teams;
using Backend.Models.Users;
using Backend.Policies;
using HotChocolate.Authorization;

namespace Backend.Graph.Mutations;

/// <summary>
/// Extension of <see cref="Mutation"/> which contains all the mutations relating to the <see cref="Team"/> object.
/// </summary>
[ExtendObjectType<Mutation>]
public class TeamMutation
{
    /// <summary>
    /// Add a new team to the database.
    /// </summary>
    /// <param name="teamService">The current team service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="owner">The guid of the owner of the new team.</param>
    /// <param name="name">The name of the new team.</param>
    /// <returns>The guid of the newly created team.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given owner could not be found in the database.</exception>
    [Error<ItemNotFoundError>]
    public Guid AddTeam(
        [Service] ITeamService teamService, 
        [Service] IUserService userService,
        [ID] Guid owner,
        string name)
    {
        // Owner guard
        if (!userService.Exists(owner)) throw new ItemNotFoundError($"User {owner}");
        
        // Create team in the database
        return teamService.Create(new TeamCreateConfiguration(name, owner));
    }
    
    /// <summary>
    /// Update a team in the database.
    /// </summary>
    /// <param name="teamService">The current team service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="team">The guid of the team which should be updated.</param>
    /// <param name="owner">The guid of the new owner of the team.</param>
    /// <param name="name">The new name of the team.</param>
    /// <returns>Whether or not the update was successful.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given owner could not be found in the database.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.WriteTeam)]
    public Result UpdateTeam(
        [Service] ITeamService teamService,
        [Service] IUserService userService,
        [ID] Guid team,
        [ID] Guid? owner,
        string? name)
    {
        // Owner guard
        if (owner is not null && !userService.Exists((Guid)owner)) throw new ItemNotFoundError($"User {owner}");

        // Update the team in the database
        teamService.Update(team, new TeamUpdateConfiguration(name, owner));
        return new Result(true);
    }
    
    /// <summary>
    /// Invite another user to the given team.
    /// </summary>
    /// <param name="teamService">The current team service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="team">The guid of the team to which the given user should be invited.</param>
    /// <param name="user">The user to whom the invite to the given team should be sent.</param>
    /// <returns>Whether or not the invite was successfully sent.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given user could not be found.</exception>
    /// <exception cref="TeamDuplicateMemberError">Thrown when the given user is already a member of the given team.</exception>
    /// <exception cref="TeamDuplicateInviteError">Thrown when the given user has already been invited to the given team.</exception>
    [Error<ItemNotFoundError>]
    [Error<TeamDuplicateMemberError>]
    [Error<TeamDuplicateInviteError>]
    [Authorize(Policy = PolicyTypes.WriteTeam)]
    public Result SendTeamInvitation(
        [Service] ITeamService teamService, 
        [Service] IUserService userService,
        [ID] Guid team, 
        string user)
    {
        // User guard
        if (!userService.Exists(user)) throw new ItemNotFoundError($"User {user}");

        var tea = teamService.Get(team);
        
        // Team member and invite checks
        if (tea.Members.Any(m => m.Email == user)) throw new TeamDuplicateMemberError();
        if (tea.Invites.Any(i => i.Email == user)) throw new TeamDuplicateInviteError();

        // Update the team in the database with the new invite
        var changes = new List<InviteChange>
        {
            new(ChangeType.Add, userService.Get(user).Id)
        };
        
        teamService.Update(team, new TeamUpdateConfiguration(invites: changes));
        return new Result(true);
    }
    
    /// <summary>
    /// Revoke a sent invitation to a user from a team.
    /// </summary>
    /// <param name="teamService">The current team service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="team">The guid of the team in which an invite to the given user exists.</param>
    /// <param name="user">The guid of the user to which an invite was sent.</param>
    /// <returns>Whether or not the invite was successfully revoked.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given user could not be found, or when the user hasn't received an invite to the given team.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.WriteTeam)]
    public Result RevokeTeamInvitation(
        [Service] ITeamService teamService, 
        [Service] IUserService userService,
        [ID] Guid team, 
        [ID] Guid user)
    {
        // User guard
        if (!userService.Exists(user)) throw new ItemNotFoundError($"User {user}");
        
        // Team invite check
        var tea = teamService.Get(team);
        if (tea.Invites.All(i => i.UserId != user)) throw new ItemNotFoundError($"Invite {user}");

        // Update the team in the database with the invite removed
        var changes = new List<InviteChange>
        {
            new(ChangeType.Remove, user)
        };
        
        teamService.Update(team, new TeamUpdateConfiguration(invites: changes));
        return new Result(true);
    }
    
    /// <summary>
    /// Accept a team invitation to the given user.
    /// </summary>
    /// <param name="teamService">The current team service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="team">The guid of the team to which the given user has been invited.</param>
    /// <param name="user">The guid of the user who has received the invite to the given team.</param>
    /// <returns>Whether or not the invite has been successfully accepted.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given user could not be found, or when the user hasn't received an invite to the given team.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.InviteMemberResponse)]
    public Result AcceptTeamInvitation(
        [Service] ITeamService teamService, 
        [Service] IUserService userService,
        [ID] Guid team, 
        [ID] Guid user)
    {
        // User guard
        if (!userService.Exists(user)) throw new ItemNotFoundError($"User {user}");
        
        // Team invite check
        var invites = userService.TeamInvites(user);
        if (invites.All(i => i.Id != team)) throw new ItemNotFoundError($"Invite {team}");
        
        // Remove the standing invite in the team and add the user as a member to the team
        var inviteChanges = new List<InviteChange> { new(ChangeType.Remove, user) };
        var memberChanges = new List<MemberChange> { new(ChangeType.Add, user) };
        
        teamService.Update(team, new TeamUpdateConfiguration(invites: inviteChanges, members: memberChanges));
        return new Result(true);
    }
    
    /// <summary>
    /// Decline a team invitation to the given user.
    /// </summary>
    /// <param name="teamService">The current team service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="team">The guid of the team to which the given user has been invited.</param>
    /// <param name="user">The guid of the user who has received the invite to the given team.</param>
    /// <returns>Whether or not the invite has been successfully declined.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given user could not be found, or when the user hasn't received an invite to the given team.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.InviteMemberResponse)]
    public Result DeclineTeamInvitation(
        [Service] ITeamService teamService, 
        [Service] IUserService userService,
        [ID] Guid team, 
        [ID] Guid user)
    {
        // User guard
        if (!userService.Exists(user)) throw new ItemNotFoundError($"User {user}");
        
        // Team invite check
        var invites = userService.TeamInvites(user);
        if (invites.All(i => i.Id != team)) throw new ItemNotFoundError($"Invite {team}");
        
        // Remove the standing invite in the team
        var inviteChanges = new List<InviteChange> { new(ChangeType.Remove, user) };
        
        teamService.Update(team, new TeamUpdateConfiguration(invites: inviteChanges));
        return new Result(true);
    }
    
    /// <summary>
    /// Kick a member out of the given team.
    /// </summary>
    /// <param name="teamService">The current team service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="team">The guid of the team in which the user who should be kicked resides.</param>
    /// <param name="user">The guid of the user who should be kicked.</param>
    /// <returns>Whether or not the user has been successfully kicked out of the team</returns>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.KickTeamMember)]
    public Result KickTeamMember(
        [Service] ITeamService teamService, 
        [Service] IUserService userService,
        [ID] Guid team, 
        [ID] Guid user)
        => LeaveTeam(teamService, userService, team, user);
    
    /// <summary>
    /// Leave a team as a member.
    /// </summary>
    /// <param name="teamService">The current team service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="team">The guid of the team which the given user should leave.</param>
    /// <param name="user">The guid of the user who should leave.</param>
    /// <returns>Whether or not the user has successfully left.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given user could not be found, or when the user isn't a member of the given team.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.LeaveTeam)]
    public Result LeaveTeam(
        [Service] ITeamService teamService, 
        [Service] IUserService userService,
        [ID] Guid team, 
        [ID] Guid user)
    {
        // User guard
        if (!userService.Exists(user)) throw new ItemNotFoundError($"User {user}");
        
        // Team member check
        var tea = teamService.Get(team);
        if (tea.Members.All(m => m.UserId != user)) throw new ItemNotFoundError($"Member {user}");
        
        // Remove user as a member from the team
        var memberChanges = new List<MemberChange> { new(ChangeType.Remove, user) };
        
        teamService.Update(team, new TeamUpdateConfiguration(members: memberChanges));
        return new Result(true);
    }
    
    /// <summary>
    /// Remove a team from the database.
    /// </summary>
    /// <param name="teamService">The current team service.</param>
    /// <param name="team">The guid of the team which should be removed from the database.</param>
    /// <returns>Whether or not the team has been successfully removed.</returns>
    [Authorize(Policy = PolicyTypes.DeleteTeam)]
    public Result RemoveTeam(
        [Service] ITeamService teamService,
        [ID] Guid team)
    {
        // Remove the team from the database.
        teamService.Delete(team);
        return new Result(true);
    }
}