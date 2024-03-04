using Backend.Models.General;

namespace Backend.Models.Projects;

/// <summary>
/// A configuration class used to define the changes of a <see cref="Tasks.Task"/> in a <see cref="Projects.Tag"/>.
/// </summary>
/// <param name="Type">Whether the task should be added or removed from the object.</param>
/// <param name="Task">The id of the task.</param>
public record LabelChange(ChangeType Type, Guid Task);