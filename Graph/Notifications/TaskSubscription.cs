using Backend.Models.Tasks;

namespace Backend.Graph.Notifications;

/// <summary>
/// Extension of <see cref="Subscription"/> which contains all the subscriptions relating to the <see cref="Models.Tasks.Task"/> object.
/// </summary>
[ExtendObjectType<Subscription>]
public class TaskSubscription
{
    /// <summary>
    /// Retrieve a stream of notifications related to all the tasks of the user.
    /// </summary>
    /// <param name="user">The user to which should be listened.</param>
    /// <param name="notification">The update notification which should be sent to the listener.</param>
    /// <returns>Updates to the tasks of the given user.</returns>
    [Subscribe]
    [Topic($"{{{nameof(user)}}}/tasks")]
    public TaskNotification UserTasks([ID] Guid user, [EventMessage] TaskNotification notification)
        => notification;
}