using Backend.Models.Teams;

namespace Backend.Graph.Notifications;

/// <summary>
/// Extension of <see cref="Subscription"/> which contains all the subscriptions relating to the <see cref="Models.Teams.Team"/> object.
/// </summary>
[ExtendObjectType<Subscription>]
public class TeamSubscription
{
    /// <summary>
    /// Retrieve a stream of notifications related to all the teams of the user.
    /// </summary>
    /// <param name="user">The user to which should be listened.</param>
    /// <param name="notification">The update notification which should be sent to the listener.</param>
    /// <returns>Updates to the teams of the given user.</returns>
    [Subscribe]
    [Topic($"{{{nameof(user)}}}/teams")]
    public TeamNotification UserTeams([ID] Guid user, [EventMessage] TeamNotification notification)
        => notification;
    
    /// <summary>
    /// Retrieve a stream of notifications related to all the team invites of the user.
    /// </summary>
    /// <param name="user">The user to which should be listened.</param>
    /// <param name="notification">The update notification which should be sent to the listener.</param>
    /// <returns>Updates to the team invites of the given user.</returns>
    [Subscribe]
    [Topic($"{{{nameof(user)}}}/teams/invites")]
    public TeamInviteNotification UserTeamInvites([ID] Guid user, [EventMessage] TeamInviteNotification notification)
        => notification;
}