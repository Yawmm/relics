using Backend.Models.Users;

namespace Backend.Models.Tasks;

/// <summary>
/// An object class used to represent a comment data model in the application.
/// </summary>
public class Comment
{
    /// <summary>
    /// The unique id of the task.
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// The content of the task.
    /// </summary>
    public string Content { get; set; } = null!;

    /// <summary>
    /// Whether or not the task is finished.
    /// </summary>
    public DateTime Timestamp { get; set; }

    /// <summary>
    /// The owner of the task.
    /// </summary>
    public Member Owner { get; set; } = null!;
}