using Backend.Core.Services.Projects;
using Backend.Errors;
using Backend.Models.General;
using Backend.Models.Projects;
using Backend.Policies;
using HotChocolate.Subscriptions;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Graph.Mutations;

/// <summary>
/// Extension of <see cref="Mutation"/> which contains all the mutations relating to the <see cref="Category"/> object.
/// </summary>
[ExtendObjectType<Mutation>]
public class CategoryMutation
{
    /// <summary>
    /// Add a new category to the database.
    /// </summary>
    /// <param name="categoryService">The current category service.</param>
    /// <param name="projectService">The current project service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="project">The guid of the project to which the category should be added.</param>
    /// <param name="name">The name of the category.</param>
    /// <returns>The guid of the newly created category.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given project couldn't be found.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.WriteProject)]
    public async Task<Guid> AddCategory(
        [Service] ICategoryService categoryService, 
        [Service] IProjectService projectService, 
        [Service] ITopicEventSender eventSender,
        [ID] Guid project,
        string name)
    {
        // Project guard
        if (!projectService.Exists(project)) throw new ItemNotFoundError($"Project {project}");
        
        // Create the project in the database
        var result = categoryService.Create(new CategoryCreateConfiguration(name, project));
       
        // Send notification event
        var proj = projectService.Get(project);
        await eventSender.SendAsync($"{proj.Id}", new ProjectNotification(NotificationType.Updated, proj));
        
        return result;
    }
    
    /// <summary>
    /// Update an existing category in the database.
    /// </summary>
    /// <param name="categoryService">The current category service.</param>
    /// <param name="projectService">The current project service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="category">The guid of the category which should be updated.</param>
    /// <param name="name">The new name of the category.</param>
    /// <returns>Whether or not the update was successful.</returns>
    [Authorize(Policy = PolicyTypes.WriteProject)]
    public async Task<Result> UpdateCategory(
        [Service] ICategoryService categoryService, 
        [Service] IProjectService projectService, 
        [Service] ITopicEventSender eventSender,
        [ID] Guid category,
        string? name)
    {
        // Update the category in the database
        categoryService.Update(category, new CategoryUpdateConfiguration(name));

        // Send notification event
        var project = projectService.Identify(category: category);
        if (project is null) throw new ItemNotFoundError($"Project {project}");
        
        var proj = projectService.Get((Guid)project);
        await eventSender.SendAsync($"{proj.Id}", new ProjectNotification(NotificationType.Updated, proj));
        
        return new Result(true);
    }
    
    /// <summary>
    /// Remove a category from the database.
    /// </summary>
    /// <param name="categoryService">The current category service.</param>
    /// <param name="projectService">The current project service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="category">The guid of the category which should be removed.</param>
    /// <returns>Whether or not the remove action was successful.</returns>
    [Authorize(Policy = PolicyTypes.DeleteCategory)]
    public async Task<Result> RemoveCategory(
        [Service] ICategoryService categoryService, 
        [Service] IProjectService projectService, 
        [Service] ITopicEventSender eventSender,
        [ID] Guid category)
    {
        var project = projectService.Identify(category: category);

        // Remove the category from the database
        categoryService.Delete(category);
        
        // Send notification event
        if (project is null) throw new ItemNotFoundError($"Project {project}");
        
        var proj = projectService.Get((Guid)project);
        await eventSender.SendAsync($"{proj.Id}", new ProjectNotification(NotificationType.Updated, proj));
        
        return new Result(true);
    }
}