namespace Backend.Policies;

/// <summary>
/// A class containing all the different types of available policies.
/// </summary>
public class PolicyTypes
{
    /// <summary>
    /// Whether or not the user is able to write to the given user profile.
    /// </summary>
    public const string WriteUserProfile = "WriteUserProfile";

    /// <summary>
    /// Whether or not the user is able to delete the given user profile.
    /// </summary>
    public const string DeleteUserProfile = "DeleteUserProfile";

    /// <summary>
    /// Whether or not the user is able to read the invites of the given user.
    /// </summary>
    public const string ReadInvites = "ReadInvites";

    
    /// <summary>
    /// Whether or not the user is able to read the given project.
    /// </summary>
    public const string ReadProject = "ReadProject";

    /// <summary>
    /// Whether or not the user is able to read the projects of the given user.
    /// </summary>
    public const string ReadProjects = "ReadProjects";
    
    /// <summary>
    /// Whether or not the user is able to write to the given project.
    /// </summary>
    public const string WriteProject = "WriteProject";
    
    /// <summary>
    /// Whether or not the user is able to delete the given project.
    /// </summary>
    public const string DeleteProject = "DeleteProject";
    
    /// <summary>
    /// Whether or not the user is able to leave the given project.
    /// </summary>
    public const string LeaveProject = "LeaveProject";
    
    /// <summary>
    /// Whether or not the user is able to kick other members from the given project.
    /// </summary>
    public const string KickProjectMember = "KickProjectMember";
    
    
    /// <summary>
    /// Whether or not the user is able to read the given team.
    /// </summary>
    public const string ReadTeam = "ReadTeam";
    
    /// <summary>
    /// Whether or not the user is able to retrieve their teams.
    /// </summary>
    public const string ReadTeams = "ReadTeams";
    
    /// <summary>
    /// Whether or not the user is able to write to the given team.
    /// </summary>
    public const string WriteTeam = "WriteTeam";
    
    /// <summary>
    /// Whether or not the user is able to delete the given team.
    /// </summary>
    public const string DeleteTeam = "DeleteTeam";
    
    /// <summary>
    /// Whether or not the user is able to leave the given team.
    /// </summary>
    public const string LeaveTeam = "LeaveTeam";
    
    /// <summary>
    /// Whether or not the user is able to kick other members from the given team.
    /// </summary>
    public const string KickTeamMember = "KickTeamMember";
    
    
    /// <summary>
    /// Whether or not the user is able to accept or decline invites to the given project.
    /// </summary>
    public const string InviteMemberResponse = "InviteMemberResponse";

    
    /// <summary>
    /// Whether or not the user is able to delete the given category.
    /// </summary>
    public const string DeleteCategory = "DeleteCategory";
    
    
    /// <summary>
    /// Whether or not the user is able to read the given tasks.
    /// </summary>
    public const string ReadTasks = "ReadTasks";
    
    /// <summary>
    /// Whether or not the user is able to write to the given task.
    /// </summary>
    public const string WriteTask = "WriteTask";
    
    /// <summary>
    /// Whether or not the user is able to delete the given comment.
    /// </summary>
    public const string DeleteComment = "DeleteComment";
    
    /// <summary>
    /// Whether or not the user is able to delete the given task.
    /// </summary>
    public const string DeleteTask = "DeleteTask";
}