using System.Text;
using Backend.Core.Database.Extensions;
using Backend.Core.Services.Extensions;
using Backend.Graph;
using Backend.Policies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

// Initialize the app
var builder = WebApplication.CreateBuilder(args);

// Initialize application database and services
builder.Services.AddApplicationDatabase();
builder.Services.AddApplicationServices()
    .ModifyAuthenticationOptions(options =>
    {
        // Set authentication settings
        options.Hashing.Iterations = 1_000_000;
        options.Token = builder.Configuration.GetSection("Authentication")
            .Get<TokenOptions>()!;
    });

// Add built-in application authentication
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(
        options =>
        {
            var secret = builder.Environment.IsProduction()
                ? Environment.GetEnvironmentVariable("APPLICATION_JWT_SECRET")
                : builder.Configuration["Authentication:Secret"];

            if (secret is null)
                throw new ApplicationException("No secret was set for the authentication service.");
                
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidAudience = builder.Configuration["Authentication:Audience"],
                ValidIssuer = builder.Configuration["Authentication:Issuer"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ClockSkew = TimeSpan.FromSeconds(5)
            };
        }
    );

// Add authorization and authorization policies
builder.Services.AddPolicyHandlers();
builder.Services.AddAuthorization(options => options.AddPolicies());

// Add graph settings
builder.Services.AddGraphQLServer()
    .AddAuthorization()
    
    .AddQueries()
    .AddMutations()
    .AddSubscriptions()
    
    .AddFiltering()
    
    .AddMutationConventions(applyToAllMutations: true)
    .ModifyRequestOptions(options => options.IncludeExceptionDetails = true);

// Add cross-origin-resource-sharing settings
builder.Services.AddCors();

// Build the app with the configured services
var app = builder.Build();

app.UseHttpsRedirection();

// Use the configured cors settings
app.UseCors(options => options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

// Use database migration/initialization
app.UseDatabaseMigrations();

// Use authentication/authorization
app.UseAuthentication();
app.UseAuthorization();

// Use websockets for subscriptions
app.UseWebSockets();

// Use graph endpoints
app.MapGraphQL();

// Use correct url
if (app.Environment.IsProduction())
{
    var port = Environment.GetEnvironmentVariable("PORT");
    var url = $"http://*:{port}";
    
    app.Urls.Add(url);
}

// Run app
app.Run();