namespace Backend.Models.General;

/// <summary>
/// A result class used to show whether the action of the endpoint succeeded.
/// </summary>
/// <param name="Success">Whether or not the action was a success.</param>
public record Result(bool Success);
