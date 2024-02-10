using Backend.Core.Services.Teams;
using Backend.Models.Teams;
using Backend.Policies;
using HotChocolate.Authorization;

namespace Backend.Graph.Queries;

/// <summary>
/// Extension of <see cref="Query"/> which contains all the queries relating to the <see cref="Team"/> object.
/// </summary>
[ExtendObjectType<Query>]
public class TeamQuery
{
    /// <summary>
    /// Retrieve a given team.
    /// </summary>
    /// <param name="teamService">The current team service.</param>
    /// <param name="team">The target team which should be retrieved.</param>
    /// <returns>The retrieved team.</returns>
    [Authorize(Policy = PolicyTypes.ReadTeam)]
    public Team GetTeam(
        [Service] ITeamService teamService, 
        [ID] Guid team)
        => teamService.Get(team);
    
    /// <summary>
    /// Retrieve all the teams of a given user.
    /// </summary>
    /// <param name="teamService">The current team service.</param>
    /// <param name="user">The target user from which the teams should be retrieved.</param>
    /// <returns>The retrieved range of teams of the user.</returns>
    [Authorize(Policy = PolicyTypes.ReadTeams)]
    public List<Team> GetTeams(
        [Service] ITeamService teamService, 
        [ID] Guid user)
        => teamService.All(user);
}