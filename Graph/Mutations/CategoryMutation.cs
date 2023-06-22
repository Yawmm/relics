using Backend.Core.Services.Projects;
using Backend.Errors;
using Backend.Models.General;
using Backend.Models.Projects;
using Backend.Policies;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Graph.Mutations;

/// <summary>
/// Extension of <see cref="Mutation"/> which contains all the mutations relating to the <see cref="Category"/> object.
/// </summary>
[ExtendObjectType<Mutation>]
public class CategoryMutation
{
    /// <summary>
    /// Add a new category to the database.
    /// </summary>
    /// <param name="categoryService">The current category service.</param>
    /// <param name="projectService">The current project service.</param>
    /// <param name="project">The guid of the project to which the category should be added.</param>
    /// <param name="name">The name of the category.</param>
    /// <returns>The guid of the newly created category.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given project couldn't be found.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.WriteProject)]
    public Guid AddCategory(
        [Service] ICategoryService categoryService, 
        [Service] IProjectService projectService, 
        [ID] Guid project,
        string name)
    {
        // Project guard
        if (!projectService.Exists(project)) throw new ItemNotFoundError($"Project {project}");
        
        // Create the project in the database
        return categoryService.Create(new CategoryCreateConfiguration(name, project));
    }
    
    /// <summary>
    /// Update an existing category in the database.
    /// </summary>
    /// <param name="categoryService">The current category service.</param>
    /// <param name="category">The guid of the category which should be updated.</param>
    /// <param name="name">The new name of the category.</param>
    /// <returns>Whether or not the update was successful.</returns>
    [Authorize(Policy = PolicyTypes.WriteProject)]
    public Result UpdateCategory(
        [Service] ICategoryService categoryService, 
        [ID] Guid category,
        string? name)
    {
        // Update the category in the database
        categoryService.Update(category, new CategoryUpdateConfiguration(name));
        return new Result(true);
    }
    
    /// <summary>
    /// Remove a category from the database.
    /// </summary>
    /// <param name="categoryService">The current category service.</param>
    /// <param name="category">The guid of the category which should be removed.</param>
    /// <returns>Whether or not the remove action was successful.</returns>
    [Authorize(Policy = PolicyTypes.DeleteCategory)]
    public Result RemoveCategory(
        [Service] ICategoryService categoryService, 
        [ID] Guid category)
    {
        // Remove the category from the database
        categoryService.Delete(category);
        return new Result(true);
    }
}