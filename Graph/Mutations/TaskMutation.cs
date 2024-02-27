using Backend.Core.Services.Projects;
using Backend.Core.Services.Tasks;
using Backend.Core.Services.Users;
using Backend.Errors;
using Backend.Models.General;
using Backend.Models.Projects;
using Backend.Models.Tasks;
using Backend.Policies;
using HotChocolate.Authorization;
using HotChocolate.Subscriptions;

namespace Backend.Graph.Mutations;

/// <summary>
/// Extension of <see cref="Mutation"/> which contains all the mutations relating to the <see cref="Task{TResult}"/> object.
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
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
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
    public async Task<Guid> AddTask(
        [Service] ITaskService taskService, 
        [Service] ICategoryService categoryService, 
        [Service] IProjectService projectService, 
        [Service] IUserService userService, 
        [Service] ITopicEventSender eventSender,
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
        var result = taskService.Create(new TaskCreateConfiguration(name, description, finished, owner, project, category));
        
        // Send notification event
        var item = taskService.Get(result);
        var proj = projectService.Get(project);
        await eventSender.SendAsync($"{owner}/tasks", new TaskNotification(NotificationType.Added, item));
        await eventSender.SendAsync($"{project}", new ProjectNotification(NotificationType.Updated, proj));

        return result;
    }
    
    /// <summary>
    /// Update an existing task in the database.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="taskService">The current task service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="task">The guid of the task which should be updated.</param>
    /// <param name="category">The guid of the category to which the task should be linked\.</param>
    /// <param name="name">The optional new name of the task.</param>
    /// <param name="description">The optional new description of the task.</param>
    /// <param name="finished">Whether or not the new task should already be marked as finished.</param>
    /// <returns>Whether or not the update was successful.</returns>
    [Authorize(Policy = PolicyTypes.WriteTask)]
    public async Task<Result> UpdateTask(
        [Service] IProjectService projectService,
        [Service] ITaskService taskService,
        [Service] ITopicEventSender eventSender,
        [ID] Guid task,
        [ID] Guid? category,
        string? name,
        string? description,
        bool? finished)
    {
        // Update the task in the database
        taskService.Update(task, new TaskUpdateConfiguration(name, description, finished, category));
        
        // Send notification event
        var item = taskService.Get(task);
        await eventSender.SendAsync($"{item.Owner.UserId}/tasks", new TaskNotification(NotificationType.Updated, item));
       
        var project = projectService.Identify(task: item.Id);
        if (project is not null)
        {
            var proj = projectService.Get((Guid)project);
            await eventSender.SendAsync($"{project}", new ProjectNotification(NotificationType.Updated, proj));
        }

        return new Result(true);
    }

    /// <summary>
    /// Add a new comment to the given task in the database.
    /// </summary>
    /// <param name="commentService">The current comment service.</param>
    /// <param name="taskService">The current task service.</param>
    /// <param name="projectService">The current project service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="task">The parent task of the comment.</param>
    /// <param name="owner">The owner of the comment.</param>
    /// <param name="content">The content of the comment.</param>
    /// <returns>The guid of the newly created comment.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the task/owner could not be found in the database.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.WriteTask)]
    public async Task<Guid> AddComment(
        [Service] ICommentService commentService,
        [Service] ITaskService taskService, 
        [Service] IUserService userService, 
        [Service] IProjectService projectService, 
        [Service] ITopicEventSender eventSender,
        [ID] Guid task,
        [ID] Guid owner,
        string content)
    {
        // Check whether or not all the given items exist.
        if (!userService.Exists(owner)) throw new ItemNotFoundError($"User {owner}");
        if (!taskService.Exists(task)) throw new ItemNotFoundError($"Task {task}");
        
        // Create the task in the database
        var result = commentService.Create(new CommentCreateConfiguration(content, owner, task));
        
        // Send notification event
        var item = taskService.Get(task);
        await eventSender.SendAsync($"{item.Owner.UserId}/tasks", new TaskNotification(NotificationType.Updated, item));
       
        var project = projectService.Identify(task: item.Id);
        if (project is not null)
        {
            var proj = projectService.Get((Guid)project);
            await eventSender.SendAsync($"{project}", new ProjectNotification(NotificationType.Updated, proj));
        }
        
        return result;
    }
    
    /// <summary>
    /// Remove a comment from the database.
    /// </summary>
    /// <param name="commentService">The current project service.</param>
    /// <param name="projectService">The current project service.</param>
    /// <param name="taskService">The current task service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="comment">The guid of the comment which should be removed.</param>
    /// <returns>Whether or not the remove action was successful.</returns>
    [Authorize(Policy = PolicyTypes.DeleteComment)]
    public async Task<Result> RemoveComment(
        [Service] ICommentService commentService,
        [Service] IProjectService projectService,
        [Service] ITaskService taskService,
        [Service] ITopicEventSender eventSender,
        [ID] Guid comment)
    {
        // Retrieve task parent for notification event
        var taskId = taskService.Identify(comment: comment);
        
        // Remove the task from the database
        var item = commentService.Get(comment);
        commentService.Delete(comment);
        
        // Send notification event
        if (taskId is null)
            return new Result(true);

        var task = taskService.Get((Guid)taskId); 
        await eventSender.SendAsync($"{item.Owner.UserId}/tasks", new TaskNotification(NotificationType.Updated, task));
        
        var project = projectService.Identify(task: taskId);
        if (project is not null)
        {
            var proj = projectService.Get((Guid)project);
            await eventSender.SendAsync($"{project}", new ProjectNotification(NotificationType.Updated, proj));
        }
        
        return new Result(true);
    }

    /// <summary>
    /// Remove a task from the database.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="taskService">The current task service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="task">The guid of the task which should be removed.</param>
    /// <returns>Whether or not the remove action was successful.</returns>
    [Authorize(Policy = PolicyTypes.DeleteTask)]
    public async Task<Result> RemoveTask(
        [Service] IProjectService projectService,
        [Service] ITaskService taskService,
        [Service] ITopicEventSender eventSender,
        [ID] Guid task)
    {
        // Remove the task from the database
        var item = taskService.Get(task);
        var project = projectService.Identify(task: item.Id);
        
        taskService.Delete(task);
        
        // Send notification event
        await eventSender.SendAsync($"{item.Owner.UserId}/tasks", new TaskNotification(NotificationType.Removed, item));
        
        if (project is not null)
        {
            var proj = projectService.Get((Guid)project);
            await eventSender.SendAsync($"{project}", new ProjectNotification(NotificationType.Updated, proj));
        }
        
        return new Result(true);
    }
}