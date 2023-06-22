namespace Backend.Errors;

/// <summary>
/// Thrown when the given user is already invited to the given project.
/// </summary>
public class ProjectDuplicateInviteError : Exception
{
    public ProjectDuplicateInviteError() : 
        base("The given user has already been invited to the given project")
    { }
}