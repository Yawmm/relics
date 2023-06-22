using Backend.Core.Services.Projects;
using Backend.Core.Services.Tasks;
using Backend.Core.Services.Users;
using Backend.Errors;
using Backend.Models.General;
using Backend.Models.Tasks;
using Backend.Policies;
using HotChocolate.Authorization;

namespace Backend.Graph.Mutations;

/// <summary>
/// Extension of <see cref="Mutation"/> which contains all the mutations relating to the <see cref="Task"/> object.
/// </summary>
[ExtendObjectType<Mutation>]
public class TaskMutation
{
    /// <summary>
    /// Add a new task to the given project/category in the database.
    /// </summary>
    /// <param name="taskService">The current task service.</param>
    /// <param name="categoryService">The current category service.</param>
    /// <param name="projectService">The current project service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="project">The project ot which the task should be linked.</param>
    /// <param name="category">The optional category under the given project to which the task should be linked.</param>
    /// <param name="owner">The owner of the task.</param>
    /// <param name="name">The name of the task.</param>
    /// <param name="description">The optional description of the task.</param>
    /// <param name="finished">Whether or not the task should already be marked as finished.</param>
    /// <returns>The guid of the newly created task.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the project/category/owner could not be found in the database.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.WriteProject)]
    public Guid AddTask(
        [Service] ITaskService taskService, 
        [Service] ICategoryService categoryService, 
        [Service] IProjectService projectService, 
        [Service] IUserService userService, 
        [ID] Guid project,
        [ID] Guid? category,
        [ID] Guid owner,
        string name, 
        string description,
        bool finished)
    {
        // Check whether or not all the given items exist.
        if (!userService.Exists(owner)) throw new ItemNotFoundError($"User {owner}");
        if (!projectService.Exists(project)) throw new ItemNotFoundError($"Project {project}");
        
        if (category is not null && !categoryService.Exists((Guid)category)) throw new ItemNotFoundError($"Category {category}");
        
        // Create the task in the database
        return taskService.Create(new TaskCreateConfiguration(name, description, finished, owner, project, category));
    }
    
    /// <summary>
    /// Update an existing task in the database.
    /// </summary>
    /// <param name="taskService">The current task service.</param>
    /// <param name="task">The guid of the task which should be updated.</param>
    /// <param name="name">The optional new name of the task.</param>
    /// <param name="description">The optional new description of the task.</param>
    /// <param name="finished">Whether or not the new task should already be marked as finished.</param>
    /// <returns>Whether or not the update was successful.</returns>
    [Authorize(Policy = PolicyTypes.WriteTask)]
    public Result UpdateTask(
        [Service] ITaskService taskService,
        [ID] Guid task,
        string? name,
        string? description,
        bool? finished)
    {
        // Update the task in the database
        taskService.Update(task, new TaskUpdateConfiguration(name, description, finished));
        return new Result(true);
    }

    /// <summary>
    /// Remove a task from the database.
    /// </summary>
    /// <param name="taskService">The current task service.</param>
    /// <param name="task">The guid of the task which should be removed.</param>
    /// <returns>Whether or not the remove action was successful.</returns>
    [Authorize(Policy = PolicyTypes.DeleteTask)]
    public Result RemoveTask(
        [Service] ITaskService taskService,
        [ID] Guid task)
    {
        // Remove the task from the database
        taskService.Delete(task);
        return new Result(true);
    }
}