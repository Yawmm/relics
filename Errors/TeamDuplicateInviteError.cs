namespace Backend.Errors;

/// <summary>
/// Thrown when the given user is already invited to the given team.
/// </summary>
public class TeamDuplicateInviteError : Exception
{
    public TeamDuplicateInviteError() : 
        base("The given user has already been invited to the given team")
    { }
}