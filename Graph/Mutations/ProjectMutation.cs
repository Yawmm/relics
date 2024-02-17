using Backend.Core.Services.Projects;
using Backend.Core.Services.Teams;
using Backend.Core.Services.Users;
using Backend.Errors;
using Backend.Models.General;
using Backend.Models.Projects;
using Backend.Models.Users;
using Backend.Policies;
using HotChocolate.Authorization;
using HotChocolate.Subscriptions;

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
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="owner">The guid of the owner of the new project.</param>
    /// <param name="name">The name of the new project.</param>
    /// <param name="description">The description of the new project.</param>
    /// <returns>The guid of the newly created project.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given owner could not be found in the database.</exception>
    [Error<ItemNotFoundError>]
    public async Task<Guid> AddProject(
        [Service] IProjectService projectService, 
        [Service] IUserService userService,
        [Service] ITopicEventSender eventSender,
        [ID] Guid owner,
        string name, 
        string description)
    {
        // Owner guard
        if (!userService.Exists(owner)) throw new ItemNotFoundError($"User {owner}");
        
        // Create project in the database
        var result = projectService.Create(new ProjectCreateConfiguration(name, owner) { Description = description });
        
        // Send notification event
        var item = projectService.Get(result);
        await eventSender.SendAsync($"{owner}/projects", new ProjectNotification(NotificationType.Added, item));

        return result;
    }

    /// <summary>
    /// Update a project in the database.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="project">The guid of the project which should be updated.</param>
    /// <param name="owner">The guid of the new owner of the project.</param>
    /// <param name="name">The new name of the project.</param>
    /// <param name="description">The new description of the project.</param>
    /// <returns>Whether or not the update was successful.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given owner could not be found in the database.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.WriteProject)]
    public async Task<Result> UpdateProject(
        [Service] IProjectService projectService,
        [Service] IUserService userService,
        [Service] ITopicEventSender eventSender,
        [ID] Guid project,
        [ID] Guid? owner,
        string? name,
        string? description)
    {
        // Owner guard
        if (owner is not null && !userService.Exists((Guid)owner)) throw new ItemNotFoundError($"User {owner}");

        // Update the project in the database
        projectService.Update(project, new ProjectUpdateConfiguration(name, description, owner));
        
        // Send notification event
        var item = projectService.Get(project);
        foreach (var member in item.Members)
            await eventSender.SendAsync($"{member.UserId}/projects", new ProjectNotification(NotificationType.Updated, item));
        await eventSender.SendAsync($"{item.Id}", new ProjectNotification(NotificationType.Updated, item));
        
        return new Result(true);
    }

    /// <summary>
    /// Invite another user to the given project.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
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
    public async Task<Result> SendProjectInvitation(
        [Service] IProjectService projectService, 
        [Service] IUserService userService,
        [Service] ITopicEventSender eventSender,
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
        var recipient = userService.Get(user);
        var changes = new List<InviteChange>
        {
            new(ChangeType.Add, recipient.Id)
        };
        
        projectService.Update(project, new ProjectUpdateConfiguration(invites: changes));
        
        // Send notification event
        proj.Invites.Add(new Invite(recipient));
        var invite = new ProjectInvite(proj);

        await eventSender.SendAsync($"{proj.Owner.UserId}/projects", new ProjectNotification(NotificationType.Updated, proj));
        await eventSender.SendAsync($"{recipient.Id}/projects/invites", new ProjectInviteNotification(NotificationType.Added, invite));
        await eventSender.SendAsync($"{proj.Id}", new ProjectNotification(NotificationType.Updated, proj));
        
        return new Result(true);
    }
    
    /// <summary>
    /// Revoke a sent invitation to a user from a project.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="project">The guid of the project in which an invite to the given user exists.</param>
    /// <param name="user">The guid of the user to which an invite was sent.</param>
    /// <returns>Whether or not the invite was successfully revoked.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given user could not be found, or when the user hasn't received an invite to the given project.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.WriteProject)]
    public async Task<Result> RevokeProjectInvitation(
        [Service] IProjectService projectService, 
        [Service] IUserService userService,
        [Service] ITopicEventSender eventSender,
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
        
        // Send notification event
        proj.Invites.Remove(proj.Invites.First(p => p.UserId == user));
        var invite = new ProjectInvite(proj);

        await eventSender.SendAsync($"{proj.Owner.UserId}/projects", new ProjectNotification(NotificationType.Updated, proj));
        await eventSender.SendAsync($"{user}/projects/invites", new ProjectInviteNotification(NotificationType.Removed, invite));
        await eventSender.SendAsync($"{proj.Id}", new ProjectNotification(NotificationType.Updated, proj));

        return new Result(true);
    }
    
    /// <summary>
    /// Accept a project invitation to the given user.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="project">The guid of the project to which the given user has been invited.</param>
    /// <param name="user">The guid of the user who has received the invite to the given project.</param>
    /// <returns>Whether or not the invite has been successfully accepted.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given user could not be found, or when the user hasn't received an invite to the given project.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.InviteMemberResponse)]
    public async Task<Result> AcceptProjectInvitation(
        [Service] IProjectService projectService, 
        [Service] IUserService userService,
        [Service] ITopicEventSender eventSender,
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
        
        // Send notification event
        var proj = projectService.Get(project);
        var invite = new ProjectInvite(proj);

        await eventSender.SendAsync($"{proj.Owner.UserId}/projects", new ProjectNotification(NotificationType.Updated, proj));
        await eventSender.SendAsync($"{user}/projects", new ProjectNotification(NotificationType.Updated, proj));
        await eventSender.SendAsync($"{user}/projects/invites", new ProjectInviteNotification(NotificationType.Removed, invite));
        await eventSender.SendAsync($"{proj.Id}", new ProjectNotification(NotificationType.Updated, proj));
        
        return new Result(true);
    }
    
    /// <summary>
    /// Decline a project invitation to the given user.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="project">The guid of the project to which the given user has been invited.</param>
    /// <param name="user">The guid of the user who has received the invite to the given project.</param>
    /// <returns>Whether or not the invite has been successfully declined.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given user could not be found, or when the user hasn't received an invite to the given project.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.InviteMemberResponse)]
    public async Task<Result> DeclineProjectInvitation(
        [Service] IProjectService projectService, 
        [Service] IUserService userService,
        [Service] ITopicEventSender eventSender,
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
        
        // Send notification event
        var proj = projectService.Get(project);
        var invite = new ProjectInvite(proj);

        await eventSender.SendAsync($"{proj.Owner.UserId}/projects", new ProjectNotification(NotificationType.Updated, proj));
        await eventSender.SendAsync($"{user}/projects/invites", new ProjectInviteNotification(NotificationType.Removed, invite));
        await eventSender.SendAsync($"{proj.Id}", new ProjectNotification(NotificationType.Updated, proj));

        return new Result(true);
    }
    
    /// <summary>
    /// Kick a member out of the given project.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="project">The guid of the project in which the user who should be kicked resides.</param>
    /// <param name="user">The guid of the user who should be kicked.</param>
    /// <returns>Whether or not the user has been successfully kicked out of the project</returns>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.KickProjectMember)]
    public async Task<Result> KickProjectMember(
        [Service] IProjectService projectService, 
        [Service] IUserService userService,
        [Service] ITopicEventSender eventSender,
        [ID] Guid project, 
        [ID] Guid user)
        => await LeaveProject(projectService, userService, eventSender, project, user);
    
    /// <summary>
    /// Leave a project as a member.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="userService">The current user service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="project">The guid of the project which the given user should leave.</param>
    /// <param name="user">The guid of the user who should leave.</param>
    /// <returns>Whether or not the user has successfully left.</returns>
    /// <exception cref="ItemNotFoundError">Thrown when the given user could not be found, or when the user isn't a member of the given project.</exception>
    [Error<ItemNotFoundError>]
    [Authorize(Policy = PolicyTypes.LeaveProject)]
    public async Task<Result> LeaveProject(
        [Service] IProjectService projectService, 
        [Service] IUserService userService,
        [Service] ITopicEventSender eventSender,
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
        
        // Send notification event
        proj.Members.Remove(proj.Members.First(m => m.UserId == user));

        await eventSender.SendAsync($"{proj.Owner.UserId}/projects", new ProjectNotification(NotificationType.Updated, proj));
        await eventSender.SendAsync($"{user}/projects", new ProjectNotification(NotificationType.Removed, proj));
        await eventSender.SendAsync($"{proj.Id}", new ProjectNotification(NotificationType.Updated, proj));

        return new Result(true);
    }

    /// <summary>
    /// Add a link to a given project.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="teamService">The current team service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="team">The guid of the team which should be added to the project.</param>
    /// <param name="project">The guid of the project to which the team should be added.</param>
    /// <returns>Whether or not the project has been successfully updated.</returns>
    [Authorize(Policy = PolicyTypes.WriteProject)]
    public async Task<Result> AddProjectLink(
        [Service] IProjectService projectService,
        [Service] ITeamService teamService,
        [Service] ITopicEventSender eventSender,
        [ID] Guid team,
        [ID] Guid project)
    {
        // Team guard
        if (!teamService.Exists(team)) throw new ItemNotFoundError($"Team {team}");

        // Add team to the project.
        var linkChanges = new List<LinkChange> { new(ChangeType.Add, team) };
        
        projectService.Update(project, new ProjectUpdateConfiguration(links: linkChanges));
        
        // Send notification event
        var tea = teamService.Get(team);
        var proj = projectService.Get(project);
        
        foreach (var member in tea.Members.Where(m => proj.Members.All(pm => pm.UserId != m.UserId)))
            await eventSender.SendAsync($"{member.UserId}/projects", new ProjectNotification(NotificationType.Added, proj));
        await eventSender.SendAsync($"{proj.Id}", new ProjectNotification(NotificationType.Updated, proj));

        return new Result(true);
    }
    
    /// <summary>
    /// Remove a link to a given project.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="teamService">The current team service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="team">The guid of the team which should be removed to the project.</param>
    /// <param name="project">The guid of the project to which the team should be removed.</param>
    /// <returns>Whether or not the project has been successfully updated.</returns>
    [Authorize(Policy = PolicyTypes.WriteProject)]
    public async Task<Result> RemoveProjectLink(
        [Service] IProjectService projectService,
        [Service] ITeamService teamService,
        [Service] ITopicEventSender eventSender,
        [ID] Guid team,
        [ID] Guid project)
    {
        // Team guard
        if (!teamService.Exists(team)) throw new ItemNotFoundError($"Team {team}");

        // Add team to the project.
        var linkChanges = new List<LinkChange> { new(ChangeType.Remove, team) };
        
        projectService.Update(project, new ProjectUpdateConfiguration(links: linkChanges));
        
        // Send notification event
        var tea = teamService.Get(team);
        var proj = projectService.Get(project);
        
        foreach (var member in tea.Members.Where(m => proj.Members.All(pm => pm.UserId != m.UserId)))
            await eventSender.SendAsync($"{member.UserId}/projects", new ProjectNotification(NotificationType.Removed, proj));
        await eventSender.SendAsync($"{proj.Id}", new ProjectNotification(NotificationType.Updated, proj));

        return new Result(true);
    }
    
    /// <summary>
    /// Remove a project from the database.
    /// </summary>
    /// <param name="projectService">The current project service.</param>
    /// <param name="eventSender">The current event sender service from which subscription updates can be sent.</param>
    /// <param name="project">The guid of the project which should be removed from the database.</param>
    /// <returns>Whether or not the project has been successfully removed.</returns>
    [Authorize(Policy = PolicyTypes.DeleteProject)]
    public async Task<Result> RemoveProject(
        [Service] IProjectService projectService,
        [Service] ITopicEventSender eventSender,
        [ID] Guid project)
    {
        // Remove the project from the database.
        var proj = projectService.Get(project);
        projectService.Delete(project);
        
        // Send notification event
        foreach (var member in proj.Members)
            await eventSender.SendAsync($"{member.UserId}/projects", new ProjectNotification(NotificationType.Removed, proj));
        await eventSender.SendAsync($"{proj.Id}", new ProjectNotification(NotificationType.Removed, proj));
        
        return new Result(true);
    }
}