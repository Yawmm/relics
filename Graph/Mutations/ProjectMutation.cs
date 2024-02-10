using Backend.Core.Services.Projects;
using Backend.Core.Services.Teams;
using Backend.Core.Services.Users;
using Backend.Errors;
using Backend.Models.General;
using Backend.Models.Projects;
using Backend.Models.Users;
using Backend.Policies;
using HotChocolate.Authorization;

namespace Backend.Graph.Mutations;

/// <summary>
/// Extension of <see cref="Mutation"/> which contains all the mutations relating to the <see cref="Project"/> object.
/// </summary>
[ExtendObjectType<Mutation>]
public class ProjectMutation
{
    /// <summary>
    /// Add a new project to the database.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="owner">The guid of the owner of the new project.</param>
    /// <param name="name">The name of the new project.</param>
    /// <param name="description">The description of the new project.</param>
    /// <returns>The guid of the newly created project.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given owner could not be found in the database.</exception>
    [Error<ItemNotFoundError>]
    public Guid AddProject(
        [Service] IProjectService projectService, 
        [Service] IUserService userService,
        [ID] Guid owner,
        string name, 
        string description)
    {
        // Owner guard
        if (!userService.Exists(owner)) throw new ItemNotFoundError($"User {owner}");
        
        // Create project in the database
        return projectService.Create(new ProjectCreateConfiguration(name, owner) { Description = description });
    }

    /// <summary>
    /// Update a project in the database.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="project">The guid of the project which should be updated.</param>
    /// <param name="owner">The guid of the new owner of the project.</param>
    /// <param name="name">The new name of the project.</param>
    /// <param name="description">The new description of the project.</param>
    /// <returns>Whether or not the update was successful.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given owner could not be found in the database.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.WriteProject)]
    public Result UpdateProject(
        [Service] IProjectService projectService,
        [Service] IUserService userService,
        [ID] Guid project,
        [ID] Guid? owner,
        string? name,
        string? description)
    {
        // Owner guard
        if (owner is not null && !userService.Exists((Guid)owner)) throw new ItemNotFoundError($"User {owner}");

        // Update the project in the database
        projectService.Update(project, new ProjectUpdateConfiguration(name, description, owner));
        return new Result(true);
    }

    /// <summary>
    /// Invite another user to the given project.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="project">The guid of the project to which the given user should be invited.</param>
    /// <param name="user">The user to whom the invite to the given project should be sent.</param>
    /// <returns>Whether or not the invite was successfully sent.</returns>
    /// <exception cref="ItemNotFoundError">THrown when the given user could not be found.</exception>
    /// <exception cref="ProjectDuplicateMemberError">Thrown when the given user is already a member of the given project.</exception>
    /// <exception cref="ProjectDuplicateInviteError">Thrown when the given user has already been invited to the given project.</exception>
    [Error<ItemNotFoundError>]
    [Error<ProjectDuplicateMemberError>]
    [Error<ProjectDuplicateInviteError>]
    [Authorize(Policy = PolicyTypes.WriteProject)]
    public Result SendProjectInvitation(
        [Service] IProjectService projectService, 
        [Service] IUserService userService,
        [ID] Guid project, 
        string user)
    {
        // User guard
        if (!userService.Exists(user)) throw new ItemNotFoundError($"User {user}");

        var proj = projectService.Get(project);
        
        // Project member and invite checks
        if (proj.Members.Any(m => m.Email == user) || proj.Links.Any(l => l.Members.Any(m => m.Email == user))) throw new ProjectDuplicateMemberError();
        if (proj.Invites.Any(i => i.Email == user)) throw new ProjectDuplicateInviteError();

        // Update the project in the database with the new invite
        var changes = new List<InviteChange>
        {
            new(ChangeType.Add, userService.Get(user).Id)
        };
        
        projectService.Update(project, new ProjectUpdateConfiguration(invites: changes));
        return new Result(true);
    }
    
    /// <summary>
    /// Revoke a sent invitiation to a user from a project.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="project">The guid of the project in which an invite to the given user exists.</param>
    /// <param name="user">The guid of the user to which an invite was sent.</param>
    /// <returns>Whether or not the invite was successfully revoked.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given user could not be found, or when the user hasn't received an invite to the given project.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.WriteProject)]
    public Result RevokeProjectInvitation(
        [Service] IProjectService projectService, 
        [Service] IUserService userService,
        [ID] Guid project, 
        [ID] Guid user)
    {
        // User guard
        if (!userService.Exists(user)) throw new ItemNotFoundError($"User {user}");
        
        // Project invite check
        var proj = projectService.Get(project);
        if (proj.Invites.All(i => i.UserId != user)) throw new ItemNotFoundError($"Invite {user}");

        // Update the project in the database with the invite removed
        var changes = new List<InviteChange>
        {
            new(ChangeType.Remove, user)
        };
        
        projectService.Update(project, new ProjectUpdateConfiguration(invites: changes));
        return new Result(true);
    }
    
    /// <summary>
    /// Accept a project invitation to the given user.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="project">The guid of the project to which the given user has been invited.</param>
    /// <param name="user">The guid of the user who has received the invite to the given project.</param>
    /// <returns>Whether or not the invite has been successfully accepted.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given user could not be found, or when the user hasn't received an invite to the given project.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.InviteMemberResponse)]
    public Result AcceptProjectInvitation(
        [Service] IProjectService projectService, 
        [Service] IUserService userService,
        [ID] Guid project, 
        [ID] Guid user)
    {
        // User guard
        if (!userService.Exists(user)) throw new ItemNotFoundError($"User {user}");
        
        // Project invite check
        var invites = userService.ProjectInvites(user);
        if (invites.All(i => i.Id != project)) throw new ItemNotFoundError($"Invite {project}");
        
        // Remove the standing invite in the project and add the user as a member to the project
        var inviteChanges = new List<InviteChange> { new(ChangeType.Remove, user) };
        var memberChanges = new List<MemberChange> { new(ChangeType.Add, user) };
        
        projectService.Update(project, new ProjectUpdateConfiguration(invites: inviteChanges, members: memberChanges));
        return new Result(true);
    }
    
    /// <summary>
    /// Decline a project invitation to the given user.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="project">The guid of the project to which the given user has been invited.</param>
    /// <param name="user">The guid of the user who has received the invite to the given project.</param>
    /// <returns>Whether or not the invite has been successfully declined.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given user could not be found, or when the user hasn't received an invite to the given project.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.InviteMemberResponse)]
    public Result DeclineProjectInvitation(
        [Service] IProjectService projectService, 
        [Service] IUserService userService,
        [ID] Guid project, 
        [ID] Guid user)
    {
        // User guard
        if (!userService.Exists(user)) throw new ItemNotFoundError($"User {user}");
        
        // Project invite check
        var invites = userService.ProjectInvites(user);
        if (invites.All(i => i.Id != project)) throw new ItemNotFoundError($"Invite {project}");
        
        // Remove the standing invite in the project
        var inviteChanges = new List<InviteChange> { new(ChangeType.Remove, user) };
        
        projectService.Update(project, new ProjectUpdateConfiguration(invites: inviteChanges));
        return new Result(true);
    }
    
    /// <summary>
    /// Kick a member out of the given project.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="project">The guid of the project in which the user who should be kicked resides.</param>
    /// <param name="user">The guid of the user who should be kicked.</param>
    /// <returns>Whether or not the user has been successfully kicked out of the project</returns>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.KickProjectMember)]
    public Result KickProjectMember(
        [Service] IProjectService projectService, 
        [Service] IUserService userService,
        [ID] Guid project, 
        [ID] Guid user)
        => LeaveProject(projectService, userService, project, user);
    
    /// <summary>
    /// Leave a project as a member.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="project">The guid of the project which the given user should leave.</param>
    /// <param name="user">The guid of the user who should leave.</param>
    /// <returns>Whether or not the user has successfully left.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given user could not be found, or when the user isn't a member of the given project.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.LeaveProject)]
    public Result LeaveProject(
        [Service] IProjectService projectService, 
        [Service] IUserService userService,
        [ID] Guid project, 
        [ID] Guid user)
    {
        // User guard
        if (!userService.Exists(user)) throw new ItemNotFoundError($"User {user}");
        
        // Project member check
        var proj = projectService.Get(project);
        if (proj.Members.All(m => m.UserId != user)) throw new ItemNotFoundError($"Member {user}");
        
        // Remove user as a member from the project
        var memberChanges = new List<MemberChange> { new(ChangeType.Remove, user) };
        
        projectService.Update(project, new ProjectUpdateConfiguration(members: memberChanges));
        return new Result(true);
    }

    /// <summary>
    /// Add a link to a given project.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="teamService">The current team service.</param>
    /// <param name="team">The guid of the team which should be added to the project.</param>
    /// <param name="project">The guid of the project to which the team should be added.</param>
    /// <returns>Whether or not the project has been successfully updated.</returns>
    [Authorize(Policy = PolicyTypes.WriteProject)]
    public Result AddProjectLink(
        [Service] IProjectService projectService,
        [Service] ITeamService teamService,
        [ID] Guid team,
        [ID] Guid project)
    {
        // Team guard
        if (!teamService.Exists(team)) throw new ItemNotFoundError($"Team {team}");

        // Add team to the project.
        var linkChanges = new List<LinkChange> { new(ChangeType.Add, team) };
        
        projectService.Update(project, new ProjectUpdateConfiguration(links: linkChanges));
        return new Result(true);
    }
    
    /// <summary>
    /// Remove a link to a given project.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="teamService">The current team service.</param>
    /// <param name="team">The guid of the team which should be removed to the project.</param>
    /// <param name="project">The guid of the project to which the team should be removed.</param>
    /// <returns>Whether or not the project has been successfully updated.</returns>
    [Authorize(Policy = PolicyTypes.WriteProject)]
    public Result RemoveProjectLink(
        [Service] IProjectService projectService,
        [Service] ITeamService teamService,
        [ID] Guid team,
        [ID] Guid project)
    {
        // Team guard
        if (!teamService.Exists(team)) throw new ItemNotFoundError($"Team {team}");

        // Add team to the project.
        var linkChanges = new List<LinkChange> { new(ChangeType.Remove, team) };
        
        projectService.Update(project, new ProjectUpdateConfiguration(links: linkChanges));
        return new Result(true);
    }
    
    /// <summary>
    /// Remove a project from the database.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="project">The guid of the project which should be removed from the database.</param>
    /// <returns>Whether or not the project has been successfully removed.</returns>
    [Authorize(Policy = PolicyTypes.DeleteProject)]
    public Result RemoveProject(
        [Service] IProjectService projectService,
        [ID] Guid project)
    {
        // Remove the project from the database.
        projectService.Delete(project);
        return new Result(true);
    }
}