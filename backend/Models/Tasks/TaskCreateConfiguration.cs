namespace Backend.Models.Tasks;

/// <summary>
/// A configuration class used to define the things which are required for creating a task.
/// </summary>
/// <param name="Name">The name of the task.</param>
/// <param name="Description">The description of the task.</param>
/// <param name="OwnerId">The id of the owner <see cref="Users.User"/> of the task.</param>
/// <param name="ProjectId">The id of the parent <see cref="Projects.Project"/> of the task.</param>
public record TaskCreateConfiguration(string Name, string Description, Guid OwnerId, Guid ProjectId)
{
    /// <summary>
    /// Whether or not the task has the finished status.
    /// </summary>
    public bool? IsFinished { get; }

    /// <summary>
    /// The id of the parent <see cref="Projects.Category"/>.
    /// </summary>
    public Guid? CategoryId { get; }

    public TaskCreateConfiguration(
        string name,
        string description, 
        bool finished, 
        Guid owner,
        Guid project,
        Guid? category) 
        : this(name, description, owner, project)
    {
        IsFinished = finished;
        CategoryId = category;
    }
}
