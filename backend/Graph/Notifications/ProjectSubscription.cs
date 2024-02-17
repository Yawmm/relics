using Backend.Models.Projects;

namespace Backend.Graph.Notifications;

/// <summary>
/// Extension of <see cref="Subscription"/> which contains all the subscriptions relating to the <see cref="Models.Projects.Project"/> object.
/// </summary>
[ExtendObjectType<Subscription>]
public class ProjectSubscription
{
    /// <summary>
    /// Retrieve a stream of notifications related to a given project.
    /// </summary>
    /// <param name="project">The project to which should be listened.</param>
    /// <param name="notification">The update notification which should be sent to the listener.</param>
    /// <returns>Updates to the given project.</returns>
    [Subscribe]
    [Topic($"{{{nameof(project)}}}")]
    public ProjectNotification Project([ID] Guid project, [EventMessage] ProjectNotification notification)
        => notification;
    
    /// <summary>
    /// Retrieve a stream of notifications related to all the projects of the user.
    /// </summary>
    /// <param name="user">The user to which should be listened.</param>
    /// <param name="notification">The update notification which should be sent to the listener.</param>
    /// <returns>Updates to the projects of the given user.</returns>
    [Subscribe]
    [Topic($"{{{nameof(user)}}}/projects")]
    public ProjectNotification UserProjects([ID] Guid user, [EventMessage] ProjectNotification notification)
        => notification;
    
    /// <summary>
    /// Retrieve a stream of notifications related to all the project invites of the user.
    /// </summary>
    /// <param name="user">The user to which should be listened.</param>
    /// <param name="notification">The update notification which should be sent to the listener.</param>
    /// <returns>Updates to the project invites of the given user.</returns>
    [Subscribe]
    [Topic($"{{{nameof(user)}}}/projects/invites")]
    public ProjectInviteNotification UserProjectInvites([ID] Guid user, [EventMessage] ProjectInviteNotification notification)
        => notification;
}