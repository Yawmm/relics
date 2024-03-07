using Backend.Core.Services.Projects;
using Backend.Errors;
using Backend.Models.General;
using Backend.Models.Projects;
using Backend.Policies;
using HotChocolate.Authorization;
using HotChocolate.Subscriptions;

namespace Backend.Graph.Mutations;

/// <summary>
/// Extension of <see cref="Mutation"/> which contains all the mutations relating to the <see cref="Tag"/> object.
/// </summary>
[ExtendObjectType<Mutation>]
public class TagMutation
{
    /// <summary>
    /// Add a new tag to the database.
    /// </summary>
    /// <param name="tagService">The current tag service.</param>
    /// <param name="projectService">The current project service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="project">The guid of the project to which the tag should be added.</param>
    /// <param name="name">The name of the tag.</param>
    /// <param name="color">The color of the tag.</param>
    /// <returns>The guid of the newly created tag.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given project couldn't be found.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.WriteProject)]
    public async Task<Guid> AddTag(
        [Service] ITagService tagService, 
        [Service] IProjectService projectService, 
        [Service] ITopicEventSender eventSender,
        [ID] Guid project,
        string name,
        string color)
    {
        // Project guard
        if (!projectService.Exists(project)) throw new ItemNotFoundError($"Project {project}");

        // Create the project in the database
        var result = tagService.Create(new TagCreateConfiguration(name, color, project));
       
        // Send notification event
        var proj = projectService.Get(project);
        await eventSender.SendAsync($"{proj.Id}", new ProjectNotification(NotificationType.Updated, proj));
        
        return result;
    }

    /// <summary>
    /// Update an existing tag in the database.
    /// </summary>
    /// <param name="tagService">The current tag service.</param>
    /// <param name="projectService">The current project service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="tag">The guid of the tag which should be updated.</param>
    /// <param name="name">The new name of the tag.</param>
    /// <param name="color">The new color of the tag.</param>
    /// <param name="tasks">The range of changes to the tasks linked to the tag.</param>
    /// <returns>Whether or not the update was successful.</returns>
    [Authorize(Policy = PolicyTypes.WriteTag)]
    public async Task<Result> UpdateTag(
        [Service] ITagService tagService, 
        [Service] IProjectService projectService, 
        [Service] ITopicEventSender eventSender,
        [ID] Guid tag,
        string? name,
        string? color,
        List<LabelChange>? tasks)
    {
        // Update the tag in the database
        tagService.Update(tag, new TagUpdateConfiguration(name, color, tasks));

        // Send notification event
        var project = projectService.Identify(tag: tag);
        if (project is null) throw new ItemNotFoundError($"Project {project}");
        
        var proj = projectService.Get((Guid)project);
        await eventSender.SendAsync($"{proj.Id}", new ProjectNotification(NotificationType.Updated, proj));
        
        return new Result(true);
    }
    
    /// <summary>
    /// Remove a tag from the database.
    /// </summary>
    /// <param name="tagService">The current tag service.</param>
    /// <param name="projectService">The current project service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="tag">The guid of the tag which should be removed.</param>
    /// <returns>Whether or not the remove action was successful.</returns>
    [Authorize(Policy = PolicyTypes.DeleteTag)]
    public async Task<Result> RemoveTag(
        [Service] ITagService tagService, 
        [Service] IProjectService projectService, 
        [Service] ITopicEventSender eventSender,
        [ID] Guid tag)
    {
        var project = projectService.Identify(tag: tag);

        // Remove the tag from the database
        tagService.Delete(tag);
        
        // Send notification event
        if (project is null) throw new ItemNotFoundError($"Project {project}");
        
        var proj = projectService.Get((Guid)project);
        await eventSender.SendAsync($"{proj.Id}", new ProjectNotification(NotificationType.Updated, proj));
        
        return new Result(true);
    }
}