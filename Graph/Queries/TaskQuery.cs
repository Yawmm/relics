using Backend.Core.Services.Tasks;
using Backend.Policies;
using Microsoft.AspNetCore.Authorization;
using Task = Backend.Models.Tasks.Task;

namespace Backend.Graph.Queries;

/// <summary>
/// Extension of <see cref="Query"/> which contains all the queries relating to the <see cref="Task"/> object.
/// </summary>
[ExtendObjectType<Query>]
public class TaskQuery
{
    /// <summary>
    /// Retrieve all the tasks of a given user.
    /// </summary>
    /// <param name="taskService">The current task service.</param>
    /// <param name="user">The target user from which the tasks should be retrieved.</param>
    /// <returns>The retrieved range of tasks of the given user.</returns>
    [Authorize(Policy = PolicyTypes.ReadTasks)]
    public List<Task> GetTasks(
        [Service] ITaskService taskService, 
        [ID] Guid user)
        => taskService.All(user);
}