namespace Backend.Core.Services.Extensions;

/// <summary>
/// Builder class used to change settings in the application.
/// </summary>
public class ApplicationBuilder
{
    private readonly IServiceCollection _services;
    
    public ApplicationBuilder(IServiceCollection services)
    {
        _services = services;
    }

    /// <summary>
    /// Modify the current application settings.
    /// </summary>
    /// <param name="action">The action by which the settings should change.</param>
    /// <returns>The same application builder.</returns>
    public ApplicationBuilder ModifyAuthenticationOptions(Action<AuthenticationOptions> action)
    {
        _services.Configure(action);
        return this;
    }
}