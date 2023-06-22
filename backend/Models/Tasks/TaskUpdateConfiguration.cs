namespace Backend.Models.Tasks;

/// <summary>
/// Configuration class used to define the things which can be changed in a <see cref="Task"/>.
/// </summary>
public class TaskUpdateConfiguration
{
    /// <summary>
    /// The new name of the task.
    /// </summary>
    public string? Name { get; }
    
    /// <summary>
    /// The new description of the task.
    /// </summary>
    public string? Description { get; }
    
    /// <summary>
    /// The new finished status of the task.
    /// </summary>
    public bool? IsFinished { get; }

    public TaskUpdateConfiguration(
        string? name = null,
        string? description = null,
        bool? finished = null)
    {
        Name = name;
        Description = description;
        IsFinished = finished;
    }
};
