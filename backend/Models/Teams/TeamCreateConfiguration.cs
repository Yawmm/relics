namespace Backend.Models.Teams;

/// <summary>
/// A configuration class used to define the things which are required for creating a team.
/// </summary>
/// <param name="Name">The name of the team</param>
/// <param name="OwnerId">The id of the user who is creating the team.</param>
public record TeamCreateConfiguration(string Name, Guid OwnerId);