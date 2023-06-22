using Backend.Core.Services.Projects;
using Backend.Models.Projects;
using Backend.Policies;
using HotChocolate.Authorization;

namespace Backend.Graph.Queries;

/// <summary>
/// Extension of <see cref="Query"/> which contains all the queries relating to the <see cref="Project"/> object.
/// </summary>
[ExtendObjectType<Query>]
public class ProjectQuery
{
    /// <summary>
    /// Retrieve a given project.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="project">The target project which should be retrieved.</param>
    /// <returns>The retrieved project.</returns>
    [Authorize(Policy = PolicyTypes.ReadProject)]
    public Project GetProject(
        [Service] IProjectService projectService, 
        [ID] Guid project)
        => projectService.Get(project);
    
    /// <summary>
    /// Retrieve all the projects of a given user.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="user">The target user from which the projects should be retrieved.</param>
    /// <returns>The retrieved range of projects of the user.</returns>
    [Authorize(Policy = PolicyTypes.ReadProjects)]
    public List<Project> GetProjects(
        [Service] IProjectService projectService, 
        [ID] Guid user)
        => projectService.All(user);
}