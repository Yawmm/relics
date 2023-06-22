namespace Backend.Utility;

/// <summary>
/// A cache class used to cache objects when mapping children of database results.
/// </summary>
public class MapCache
{
    /// <summary>
    /// The actual caceh database which can store the objects of any type.
    /// </summary>
    private readonly Dictionary<Type, Dictionary<Guid, object>> _cache = new();

    /// <summary>
    /// Retrieve or add a new object to the local mapping cache.
    /// </summary>
    public T Retrieve<T>(Guid? id, T? item)
    {
        if (id is null) throw new ArgumentNullException(nameof(id));
        if (item is null) throw new ArgumentNullException(nameof(item));
        
        var type = typeof(T);
        
        // Try and retrieve the typed list from the cache, if it exists 
        // add the item to the typed list.
        if (_cache.TryGetValue(type, out var value))
            return value.TryAdd((Guid)id, item) ? item : (T)value[(Guid)id];

        var dict = new Dictionary<Guid, object> { { (Guid)id, item } };
        _cache.Add(type, dict);

        return item;
    }
}