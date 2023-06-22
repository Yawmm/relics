namespace Backend.Errors;

/// <summary>
/// Thrown when the given item could not be found.
/// </summary>
public class ItemNotFoundError : Exception
{
    public ItemNotFoundError(string name) : 
        base($"The given item, {name.ToLower()}, does not exist in the database.")
    { }
}