using Backend.Models.General;

namespace Backend.Models.Tasks;

/// <summary>
/// A configuration class used to define the changes of a <see cref="Tasks.Task"/>.
/// </summary>
/// <param name="Type">Whether the task should be added or removed from the object.</param>
/// <param name="Task">The task which was changed.</param>
public record TaskNotification(NotificationType Type, Task? Task);