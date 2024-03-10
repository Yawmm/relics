namespace Backend.Core.Services.Extensions;

/// <summary>
/// Options object used to change application wide settings.
/// </summary>
public class ApplicationServiceOptions { }

/// <summary>
/// Options object used to change authentication settings.
/// </summary>
public class AuthenticationOptions
{
    /// <summary>
    /// The token settings for authentication.
    /// </summary>
    public TokenOptions Token { get; set; } = new();
    
    /// <summary>
    /// The hashing settings for authentication.
    /// </summary>
    public HashingOptions Hashing { get; } = new();
}

/// <summary>
/// Options object used to change token settings.
/// </summary>
public class TokenOptions
{
    /// <summary>
    /// The issuer of the access token.
    /// </summary>
    public string Issuer { get; set; } = null!;

    /// <summary>
    /// The target audience of the access token.
    /// </summary>
    public string Audience { get; set; } = null!;
    
    /// <summary>
    /// The secret used to sign the access tokens.
    /// </summary>
    public string? Secret { get; set; }

    /// <summary>
    /// The lifespan of the token, in minutes.
    /// </summary>
    public int Lifespan { get; set; } = 60 * 60 * 24;
}

/// <summary>
/// The hashing options for the token.
/// </summary>
public class HashingOptions
{
    /// <summary>
    /// The amount of iterations which should be used for hashing a password.
    /// </summary>
    public int Iterations { get; set; } = 100_000;
    
    /// <summary>
    /// The block size of the hashing.
    /// </summary>
    public int Size { get; set; } = 128;
}