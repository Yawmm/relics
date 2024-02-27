using System.Data;
using Backend.Errors;
using Backend.Models.General;
using Backend.Models.Projects;
using Backend.Models.Tasks;
using Backend.Models.Teams;
using Backend.Models.Users;
using Backend.Utility;
using Dapper;
using Task = Backend.Models.Tasks.Task;

namespace Backend.Core.Services.Teams;

/// <summary>
/// A service used to manage <see cref="Team"/> entities in the database.
/// </summary>
public interface ITeamService
{
    /// <summary>
    /// Check whether or not a <see cref="Team"/> by the given <see cref="Guid"/> exists.
    /// </summary>
    /// <param name="id">The guid of the <see cref="Team"/> which should be checked.</param>
    /// <returns>Whether or not the <see cref="Team"/> exists.</returns>
    bool Exists(Guid id);
    
    /// <summary>
    /// Create a new <see cref="Team"/>.
    /// </summary>
    /// <param name="configuration">The configuration by which the <see cref="Team"/> should be created.</param>
    /// <returns>The <see cref="Guid"/> of the newly created <see cref="Team"/>.</returns>
    Guid Create(TeamCreateConfiguration configuration);

    /// <summary>
    /// Retrieve a <see cref="Team"/> by the given <see cref="Guid"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="Team"/>.</param>
    /// <returns>The retrieved <see cref="Team"/>.</returns>
    Team Get(Guid id);
    
    /// <summary>
    /// Retrieve the range of <see cref="Team"/> objects linked to a user by the given user <see cref="Guid"/>.
    /// </summary>
    /// <param name="userId">The <see cref="Guid"/> of the <see cref="User"/>.</param>
    /// <returns>The retrieved range of <see cref="Team"/> objects linked to the user.</returns>
    List<Team> All(Guid userId);

    /// <summary>
    /// Update an existing <see cref="Team"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="Team"/> which should be updated.</param>
    /// <param name="configuration">The configuration by which the <see cref="Team"/> should be updated.</param>
    void Update(Guid id, TeamUpdateConfiguration configuration);

    /// <summary>
    /// Delete an existing <see cref="Team"/> by the given <see cref="Guid"/>.
    /// </summary>
    /// <param name="id">The <see cref="Guid"/> of the <see cref="Team"/> which should be deleted.</param>
    void Delete(Guid id);
}

/// <inheritdoc cref="ITeamService"/>>
public class TeamService : ITeamService
{
    /// <summary>
    /// The connection to the current database.
    /// </summary>
    private readonly IDbConnection _connection;
    
    /// <summary>
    /// Initialize the <see cref="Team"/> service.
    /// </summary>
    /// <param name="connection">The connection to the current database.</param>
    public TeamService(IDbConnection connection)
    {
        _connection = connection;
    }

    /// <inheritdoc cref="ITeamService.Exists"/>>
    public bool Exists(Guid id)
        => _connection.ExecuteScalar<bool>(
            """SELECT count(DISTINCT 1) FROM "Team" t WHERE t.Id = @Id""", 
            new { id }
        );

    /// <inheritdoc cref="ITeamService.Create"/>>
    public Guid Create(TeamCreateConfiguration configuration)
    {
        var id = _connection.QuerySingle<Guid>(
            """
            INSERT INTO "Team" (Name, OwnerId)
            VALUES (@Name, @OwnerId)
            RETURNING Id
            """, new
            {
                configuration.Name, 
                configuration.OwnerId
            }
        );

        _connection.Execute(
            """
            INSERT INTO "TeamMember" (UserId, TeamId)
            VALUES (@UserId, @TeamId)
            """,
            new
            {
                UserId = configuration.OwnerId,
                TeamId = id
            }
        );

        return id;
    }

    /// <inheritdoc cref="ITeamService.Get"/>>
    public Team Get(Guid id)
    {
        // Check if the item exists before attempting to retrieve
        // it from the database.
        if (!Exists(id))
            throw new ItemNotFoundError($"Team {id}");

        var cache = new MapCache();
        
        // Same thing as the project mapping applies here. This sucks, but migrating to EF core sucks more.
        // We need to fetch ALL the data because we're using this service for a GraphQL API where fields can be picked.
        // Optimizing just becomes a lot harder.
        var result = _connection.Query(
            sql: """
            SELECT t.*,
                
                   tlp.*,
                   tlpu.Id, tlpu.Username, tlpu.Email,
                   tlpmu.Id, tlpmu.Username, tlpmu.Email,
                   tlpiu.Id, tlpiu.Username, tlpiu.Email,
                   tlplt.*,
                   tlpltu.Id, tlpltu.Username, tlpltu.Email,
                   tlpltmu.Id, tlpltmu.Username, tlpltmu.Email,
                   tlpc.*,
                   tlpct.*,
                   tlpctu.Id, tlpctu.Username, tlpctu.Email,
                   tlpctc.Id, tlpctc.Content, tlpctc.Timestamp,
                   tlpctcu.Id, tlpctcu.Username, tlpctcu.Email,
                   tlpt.*,
                   tlptu.Id, tlptu.Username, tlptu.Email,
                   tlptc.Id, tlptc.Content, tlptc.Timestamp,
                   tlptcu.Id, tlptcu.Username, tlptcu.Email,
                   
                   tu.Id, tu.Username, tu.Email,
                   tmu.Id, tmu.Username, tmu.Email,
                   tiu.Id, tiu.Username, tiu.Email
                    
            FROM "Team" t
                LEFT JOIN "User" tu ON t.OwnerId = tu.Id
                LEFT JOIN "TeamMember" tm ON tm.TeamId = t.Id
                    LEFT JOIN "User"  tmu ON tm.UserId = tmu.Id
                LEFT JOIN "TeamInvite" ti ON ti.TeamId = t.Id
                    LEFT JOIN "User" tiu ON ti.UserId = tiu.Id
                LEFT JOIN "Link" tl ON tl.TeamId = t.Id
                    LEFT JOIN "Project" tlp ON tl.ProjectID = tlp.Id
                        LEFT JOIN "User" tlpu ON tlp.OwnerId = tlpu.Id
                        LEFT JOIN "ProjectMember" tlpm ON tlpm.ProjectId = tlp.Id
                            LEFT JOIN "User" tlpmu ON tlpm.UserId = tlpmu.Id
                        LEFT JOIN "ProjectInvite" tlpi ON tlpi.ProjectId = tlp.id
                            LEFT JOIN "User" tlpiu ON tlpi.UserId = tlpiu.Id
                        LEFT JOIN "Link" tlpl ON tlpl.ProjectId = tlp.Id
                            LEFT JOIN "Team" tlplt ON tlpl.TeamId = tlplt.Id
                                LEFT JOIN "User" tlpltu ON tlplt.OwnerId = tlpltu.Id
                                LEFT JOIN "TeamMember" tlpltm ON tlpltm.TeamId = tlplt.id
                                    LEFT JOIN "User" tlpltmu ON tlpltm.UserId = tlpltmu.Id
                        LEFT JOIN "Task" tlpt ON tlpt.ProjectId = tlp.Id AND tlpt.CategoryId IS NULL
                            LEFT JOIN "User" tlptu ON tlpt.OwnerId = tlptu.Id
                            LEFT JOIN "Comment" tlptc ON tlptc.TaskId = tlpt.Id
                                LEFT JOIN "User" tlptcu ON tlptc.OwnerId = tlptcu.Id
                        LEFT JOIN "Category" tlpc ON tlpc.ProjectId = tlp.Id
                            LEFT JOIN "Task" tlpct ON tlpct.CategoryId = tlpc.Id
                                LEFT JOIN "User" tlpctu ON tlpct.OwnerId = tlpctu.Id
                                LEFT JOIN "Comment" tlpctc ON tlpctc.TaskId = tlpct.Id
                                    LEFT JOIN "User" tlpctcu ON tlpctc.OwnerId = tlpctcu.Id
            WHERE t.Id = @Id
            """,
            types: new []
            {
                typeof(Team),
                typeof(Project), typeof(User), typeof(User), typeof(User), 
                    typeof(Team), typeof(User), typeof(User),
                    typeof(Category), typeof(Task), typeof(User), typeof(Comment), typeof(User),
                    typeof(Task), typeof(User), typeof(Comment), typeof(User),
                typeof(User),
                typeof(User),
                typeof(User)
            },
            map: objects => MapTeam(cache, objects),
            param: new { id }
        ).FirstOrDefault();
        
        // Check if the retrieved item is not null.
        if (result is null)
            throw new ItemNotFoundError($"Team {id}");

        return result;
    }

    /// <inheritdoc cref="ITeamService.All"/>>
    public List<Team> All(Guid userId)
    {
        var cache = new MapCache();
        
        // Same thing as the single get applies here.
        var result = _connection.Query(
            sql: """
            SELECT t.*,
                
                   tlp.*,
                   tlpu.Id, tlpu.Username, tlpu.Email,
                   tlpmu.Id, tlpmu.Username, tlpmu.Email,
                   tlpiu.Id, tlpiu.Username, tlpiu.Email,
                   tlplt.*,
                   tlpltu.Id, tlpltu.Username, tlpltu.Email,
                   tlpltmu.Id, tlpltmu.Username, tlpltmu.Email,
                   tlpc.*,
                   tlpct.*,
                   tlpctu.Id, tlpctu.Username, tlpctu.Email,
                   tlpctc.Id, tlpctc.Content, tlpctc.Timestamp,
                   tlpctcu.Id, tlpctcu.Username, tlpctcu.Email,
                   tlpt.*,
                   tlptu.Id, tlptu.Username, tlptu.Email,
                   tlptc.Id, tlptc.Content, tlptc.Timestamp,
                   tlptcu.Id, tlptcu.Username, tlptcu.Email,
                   
                   tu.Id, tu.Username, tu.Email,
                   tmu.Id, tmu.Username, tmu.Email,
                   tiu.Id, tiu.Username, tiu.Email
                    
            FROM "Team"
                LEFT JOIN "User" u ON u.Id = @UserId
                LEFT JOIN "TeamMember" m ON m.UserId = u.Id
                    LEFT JOIN "Team" t ON m.TeamId = t.Id 
                        LEFT JOIN "User" tu ON t.OwnerId = tu.Id
                        LEFT JOIN "TeamMember" tm ON tm.TeamId = t.Id
                            LEFT JOIN "User"  tmu ON tm.UserId = tmu.Id
                        LEFT JOIN "TeamInvite" ti ON ti.TeamId = t.Id
                            LEFT JOIN "User" tiu ON ti.UserId = tiu.Id
                        LEFT JOIN "Link" tl ON tl.TeamId = t.Id
                            LEFT JOIN "Project" tlp ON tl.ProjectID = tlp.Id
                                LEFT JOIN "User" tlpu ON tlp.OwnerId = tlpu.Id
                                LEFT JOIN "ProjectMember" tlpm ON tlpm.ProjectId = tlp.Id
                                    LEFT JOIN "User" tlpmu ON tlpm.UserId = tlpmu.Id
                                LEFT JOIN "ProjectInvite" tlpi ON tlpi.ProjectId = tlp.id
                                    LEFT JOIN "User" tlpiu ON tlpi.UserId = tlpiu.Id
                                LEFT JOIN "Link" tlpl ON tlpl.ProjectId = tlp.Id
                                    LEFT JOIN "Team" tlplt ON tlpl.TeamId = tlplt.Id
                                        LEFT JOIN "User" tlpltu ON tlplt.OwnerId = tlpltu.Id
                                        LEFT JOIN "TeamMember" tlpltm ON tlpltm.TeamId = tlplt.id
                                            LEFT JOIN "User" tlpltmu ON tlpltm.UserId = tlpltmu.Id
                                LEFT JOIN "Task" tlpt ON tlpt.ProjectId = tlp.Id AND tlpt.CategoryId IS NULL
                                    LEFT JOIN "User" tlptu ON tlpt.OwnerId = tlptu.Id
                                LEFT JOIN "Comment" tlptc ON tlptc.TaskId = tlpt.Id
                                        LEFT JOIN "User" tlptcu ON tlptc.OwnerId = tlptcu.Id
                                LEFT JOIN "Category" tlpc ON tlpc.ProjectId = tlp.Id
                                    LEFT JOIN "Task" tlpct ON tlpct.CategoryId = tlpc.Id
                                        LEFT JOIN "User" tlpctu ON tlpct.OwnerId = tlpctu.Id
                                        LEFT JOIN "Comment" tlpctc ON tlpctc.TaskId = tlpct.Id
                                            LEFT JOIN "User" tlpctcu ON tlpctc.OwnerId = tlpctcu.Id
            """,
            types: new []
            {
                typeof(Team),
                typeof(Project), typeof(User), typeof(User), typeof(User), 
                    typeof(Team), typeof(User), typeof(User),
                    typeof(Category), typeof(Task), typeof(User), typeof(Comment), typeof(User),
                    typeof(Task), typeof(User), typeof(Comment), typeof(User),
                typeof(User),
                typeof(User),
                typeof(User)
            },
            map: objects => MapTeam(cache, objects),
            param: new { userId }
        ) ?? new List<Team>();
        
        return result.Where(r => r.Id != Guid.Empty)
            .Distinct()
            .ToList();
    }

    /// <inheritdoc cref="ITeamService.Update"/>>
    public void Update(Guid id, TeamUpdateConfiguration configuration)
    {
        // Update all properties except members
        if (configuration.Name is not null || 
            configuration.OwnerId is not null)
            _connection.Execute(
                """
                UPDATE "Team" t
                SET
                    Name = coalesce(@Name, Name),
                    OwnerId = coalesce(@OwnerId, OwnerId)
                WHERE t.Id = @Id
                """,
                new
                {
                    id,
                    configuration.Name,
                    configuration.OwnerId
                }
            );
        
        if (configuration.Invites is not null)
        {
            // Update team invites
            foreach (var (change, user) in configuration.Invites)
            {
                var command = change switch
                {
                    ChangeType.Add => """
                                      INSERT INTO "TeamInvite" (UserId, TeamId)
                                      VALUES (@UserId, @TeamId);
                                      """,
                    ChangeType.Remove => """
                                         DELETE FROM "TeamInvite" m
                                         WHERE
                                             m.UserId = @UserId AND
                                             m.TeamId = @TeamId
                                         """,
                    _ => throw new ArgumentOutOfRangeException(nameof(configuration.Invites))
                };

                try
                {
                    _connection.Execute(command, new { UserId = user, TeamId = id });
                }
                catch { /* ignored */ }
            }
        }

        if (configuration.Members is not null)
        {
            // Update team members
            foreach (var (change, member) in configuration.Members)
            {
                var command = change switch
                {
                    ChangeType.Add => """
                                      INSERT INTO "TeamMember" (UserId, TeamId)
                                      VALUES (@UserId, @TeamId);
                                      """,
                    ChangeType.Remove => """
                                         DELETE FROM "TeamMember" m
                                         WHERE
                                             m.UserId = @UserId AND
                                             m.TeamId = @TeamId
                                         """,
                    _ => throw new ArgumentOutOfRangeException(nameof(configuration.Members))
                };

                try
                {
                    _connection.Execute(command, new { UserId = member, TeamId = id });
                }
                catch { /* ignored */ }
            }
        }
    }

    /// <inheritdoc cref="ITeamService.Delete"/>>
    public void Delete(Guid id)
    {
        // Check if the item exists before attempting to delete
        // it from the database.
        if (!Exists(id))
            throw new ItemNotFoundError($"Team {id}");
    
        _connection.Execute("""DELETE FROM "Team" t WHERE t.Id = @Id""", new { id });
    }
    
    /// <summary>
    /// Map an SQL-response from <see cref="Dapper"/> to a single team.
    /// </summary>
    /// <param name="mapCache">The used cache for the mapping.</param>
    /// <param name="objects">The range of objects returned from the SQL-query.</param>
    /// <returns>The fully mapped project.</returns>
    private Team MapTeam(MapCache mapCache, object[] objects)
    {
        if (objects[0] is not Team team)
            throw new ArgumentNullException(nameof(objects));

        // Retrieve team reference
        var teamRef = mapCache.Retrieve(team.Id, team);

        if (objects[1] is Project project)
        {
            // Retrieve project reference
            var projectRef = mapCache.Retrieve(project.Id, project);
            
            // Add project to team reference
            if (teamRef.Projects.All(p => p.Id != projectRef.Id))
                teamRef.Projects.Add(projectRef);

            // Link owner of project to project reference
            if (objects[2] is User projectOwner)
                projectRef.Owner = new Member(projectOwner);
            
            // Add member to project reference
            if (objects[3] is User projectMember && projectRef.Members.All(m => m.UserId != projectMember.Id))
                projectRef.Members.Add(new Member(projectMember));
            
            // Add invite to project reference
            if (objects[4] is User projectInvite && projectRef.Invites.All(i => i.UserId != projectInvite.Id))
                projectRef.Invites.Add(new Invite(projectInvite));

            if (objects[5] is Team projectTeam && projectRef.Links.All(l => l.Id != projectTeam.Id))
            {
                var projectLink = new Link
                {
                    Id = projectTeam.Id,
                    Name = projectTeam.Name
                };
                
                // Retrieve link reference
                var projectLinkRef = mapCache.Retrieve(projectLink.Id, projectLink);
                
                // Add link to project reference
                if (projectRef.Links.All(l => l.Id != projectLinkRef.Id))
                    projectRef.Links.Add(projectLinkRef);
                
                // Link owner of link to link reference
                if (objects[6] is User projectLinkOwner)
                    projectLinkRef.Owner = new Member(projectLinkOwner);
                
                // Add member to link reference
                if (objects[7] is User projectLinkMember && projectLinkRef.Members.All(m => m.UserId != projectLinkMember.Id))
                    projectLinkRef.Members.Add(new Member(projectLinkMember));
            }

            if (objects[8] is Category projectCategory && project.Categories.All(c => c.Id != projectCategory.Id))
            {
                // Retrieve category reference
                var projectCategoryRef = mapCache.Retrieve(projectCategory.Id, projectCategory);
                if (projectRef.Categories.All(l => l.Id != projectCategoryRef.Id))
                    projectRef.Categories.Add(projectCategoryRef);

                if (objects[9] is Task projectCategoryTask)
                {
                    // Retrieve task reference
                    var projectCategoryTaskRef = mapCache.Retrieve(projectCategoryTask.Id, projectCategoryTask);
                   
                    // Add task to category reference
                    if (projectCategoryRef.Tasks.All(t => t.Id != projectCategoryTaskRef.Id))
                        projectCategoryRef.Tasks.Add(projectCategoryTaskRef);

                    // Link owner of task to task reference
                    if (objects[10] is User categoryTaskOwner)
                        projectCategoryTaskRef.Owner = new Member(categoryTaskOwner);

                    if (objects[11] is Comment categoryTaskComment && projectCategoryTaskRef.Comments.All(c => c.Id != categoryTaskComment.Id)) 
                    {
                        // Retrieve comment reference
                        var categoryTaskCommentRef = mapCache.Retrieve(categoryTaskComment.Id, categoryTaskComment);
                        
                        // Add comment to task reference
                        projectCategoryTaskRef.Comments.Add(categoryTaskComment);

                        // Link owner of comment to comment reference
                        if (objects[12] is User categoryTaskCommentOwner)
                            categoryTaskCommentRef.Owner = new Member(categoryTaskCommentOwner);
                    }
                }
            }

            if (objects[13] is Task projectTask && project.Tasks.All(t => t.Id != projectTask.Id))
            {
                // Retrieve task reference
                var projectTaskRef = mapCache.Retrieve(projectTask.Id, projectTask);
                
                // Add task to project reference
                projectRef.Tasks.Add(projectTaskRef);

                // Link owner of task to task reference
                if (objects[14] is User projectTaskOwner)
                    projectTaskRef.Owner = new Member(projectTaskOwner);
                
                if (objects[15] is Comment projectTaskComment && projectTaskRef.Comments.All(c => c.Id != projectTaskComment.Id)) 
                {
                    // Retrieve comment reference
                    var projectTaskCommentRef = mapCache.Retrieve(projectTaskComment.Id, projectTaskComment);
                        
                    // Add comment to task reference
                    projectTaskRef.Comments.Add(projectTaskComment);

                    // Link owner of comment to comment reference
                    if (objects[16] is User projectTaskCommentOwner)
                        projectTaskCommentRef.Owner = new Member(projectTaskCommentOwner);
                }
            }
        }
        
        // Link owner of team to team reference
        if (objects[17] is User owner) 
            teamRef.Owner = new Member(owner);
        
        // Add member to team reference
        if (objects[18] is User member && teamRef.Members.All(m => m.UserId != member.Id))
            teamRef.Members.Add(new Member(member));
        
        // Add invite to team reference
        if (objects[19] is User invite && teamRef.Invites.All(i => i.UserId != invite.Id))
            teamRef.Invites.Add(new Invite(invite));

        return teamRef;
    }
}