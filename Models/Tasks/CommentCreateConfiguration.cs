namespace Backend.Models.Tasks;

/// <summary>
/// A configuration class used to define the things which are required for creating a comment.
/// </summary>
/// <param name="Content">The content of the comment.</param>
/// <param name="OwnerId">The id of the owner <see cref="Users.User"/> of the comment.</param>
/// <param name="TaskId">The id of the parent <see cref="Tasks.Task"/> of the comment.</param>
public record CommentCreateConfiguration(string Content, Guid OwnerId, Guid TaskId)
{
    /// <summary>
    /// The timestamp on which the comment was created.
    /// </summary>
    public DateTime? Timestamp { get; set; }
    
    public CommentCreateConfiguration(
        string content,
        Guid owner,
        Guid task,
        DateTime? timestamp) 
        : this(content, owner, task)
    {
        Timestamp = timestamp;
    }
}