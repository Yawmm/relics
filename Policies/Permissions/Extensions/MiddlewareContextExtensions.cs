using HotChocolate.Resolvers;

namespace Backend.Policies.Permissions.Extensions;

/// <summary>
/// An extension class used to extend the middleware context of the hot chocolate framework..
/// </summary>
public static class MiddlewareContextExtensions
{
    /// <summary>
    /// Retrieve a value from the graph request (depth limited to two).
    /// </summary>
    /// <param name="middleware">The context of the current graph request.</param>
    /// <param name="key">The key of the kvp which should be found.</param>
    /// <param name="value">The retrieved value from the graph request.</param>
    /// <typeparam name="T">The type of the retrieved value.</typeparam>
    /// <returns>Whether or not the key could be found in the graph request.</returns>
    public static bool GetValue<T>(this IMiddlewareContext middleware, string key, out Optional<T> value)
        where T : IParsable<T>
    {
        try
        {
            // Try and retrieve the value from the first layer.
            value = middleware.ArgumentOptional<T>(key);
            return true;
        }
        catch
        {
            // Initialize the value 
            value = Optional<T>.Empty();
            
            // Retrieve the graph input object
            var obj = middleware.ArgumentValue<object>("input");
            if (obj is not Dictionary<string, object> dict)
                return false;

            // Find all the matches to the given key
            var matches = dict.Where(list => list.Key.Contains(key))
                .Select(s => s.Value)
                .ToList();
            
            // Matches guard
            if (!matches.Any())
                return false;

            // Cast and set the value of the retrieved value
            if (matches.First() is string s)
                value = T.Parse(s, null);
            else
                value = (T)(matches.First());
            
            // Value could be found, return true
            return true;
        }
    }
}