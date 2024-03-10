using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Backend.Core.Services.Extensions;
using Backend.Models.Users;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Core.Services.Authentication;

/// <summary>
/// A service used to manage authentication in the application.
/// </summary>
public interface IAuthenticationService
{
    /// <summary>
    /// Hash a string by using the <see cref="Rfc2898DeriveBytes"/> class and generating a random salt.
    /// Format of the hash is as follows: SALT.HASH
    /// </summary>
    /// <param name="password">The string of characters which should be hashed.</param>
    /// <returns>The combined salt and hash string.</returns>
    string Hash(string password);

    /// <summary>
    /// Verify whether or not the given password matches the given hash.
    /// </summary>
    /// <param name="hash">The hash which has been challenged.</param>
    /// <param name="password">The password which should be compared to the hash.</param>
    /// <returns>Whether or not the password is identical to the hashed password.</returns>
    bool Challenge(string hash, string password);

    /// <summary>
    /// Generate a new ID token for the given <see cref="User"/>.
    /// </summary>
    /// <returns>The newly generated ID token for the given <see cref="User"/>.</returns>
    string Token(User user);
}

/// <inheritdoc cref="IAuthenticationService"/>
public class AuthenticationService : IAuthenticationService
{
    /// <summary>
    /// The options for authentication.
    /// </summary>
    private readonly AuthenticationOptions _options;
    
    /// <summary>
    /// Initialize the authentication service.
    /// </summary>
    /// <param name="options">The options for authentication.</param>
    public AuthenticationService(IOptions<AuthenticationOptions> options)
    {
        _options = options.Value;
    }
    
    /// <inheritdoc cref="IAuthenticationService.Hash"/>
    public string Hash(string password)
    {
        var salt = new byte[_options.Hashing.Size / 16];
        using (var rng = RandomNumberGenerator.Create())
            rng.GetBytes(salt);

        var pbkfd2 = new Rfc2898DeriveBytes(password, salt, _options.Hashing.Iterations, HashAlgorithmName.SHA384)
            .GetBytes(_options.Hashing.Size / 16);
        
        return Convert.ToBase64String(salt) + "." + Convert.ToBase64String(pbkfd2);
    }

    /// <inheritdoc cref="IAuthenticationService.Challenge"/>
    public bool Challenge(string hash, string password)
    {
        try
        {
            var split = hash.Split('.');
            
            var salt = Convert.FromBase64String(split[0]);
            var challenge = Convert.FromBase64String(split[1]);
            
            var attempt = new Rfc2898DeriveBytes(password, salt, _options.Hashing.Iterations, HashAlgorithmName.SHA384)
                .GetBytes(_options.Hashing.Size / 16);

            return attempt.SequenceEqual(challenge);
        }
        catch
        {
            return false;
        }
    }

    /// <inheritdoc cref="IAuthenticationService.Token"/>
    public string Token(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Name, user.Username),
            new(JwtRegisteredClaimNames.Email, user.Email)
        };

        var secret = _options.Token.Secret ?? Environment.GetEnvironmentVariable("APPLICATION_JWT_SECRET");
        if (secret is null)
            throw new ApplicationException("No secret was set for the authentication service.");

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_options.Token.Lifespan),
            Issuer = _options.Token.Issuer,
            Audience = _options.Token.Audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)), 
                SecurityAlgorithms.HmacSha384Signature
            )
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var jwt = tokenHandler.WriteToken(token);

        return jwt;
    }
}