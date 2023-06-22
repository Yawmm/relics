namespace Backend.Errors;

/// <summary>
/// Exception thrown when the given user is already a member of the given project.
/// </summary>
public class ProjectDuplicateMemberError : Exception
{
    public ProjectDuplicateMemberError() : 
        base("The given user is already a member of the given project")
    { }
}