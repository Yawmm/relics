namespace Backend.Errors;

/// <summary>
/// Exception thrown when the given user is already a member of the given team.
/// </summary>
public class TeamDuplicateMemberError : Exception
{
    public TeamDuplicateMemberError() : 
        base("The given user is already a member of the given team")
    { }
}