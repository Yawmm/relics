using HotChocolate.Authorization;
using Task = Backend.Models.Tasks.Task;

namespace Backend.Models.Projects;

/// <summary>
/// An object class used to represent the category data model in the application.
/// </summary>
[Authorize]
public class Category
{
    /// <summary>
    /// The unique id of the category.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// The name of the category.
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// The range of tasks of the category.
    /// </summary>
    public List<Task> Tasks { get; set; } = new List<Task>();
}