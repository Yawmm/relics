using System.Security.Claims;
using Backend.Core.Services.Teams;
using Backend.Policies.Permissions.Extensions;
using Backend.Policies.Permissions.Variants.Teams;
using HotChocolate.Resolvers;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Policies.Permissions.Handlers.Teams;

/// <inheritdoc cref="IPermissionHandler{T}"/>
public class IsTeamOwnerPermissionHandler : IPermissionHandler<IsTeamOwnerPermission>
{
    private readonly ITeamService _teamService;

    public IsTeamOwnerPermissionHandler(ITeamService teamService)
    {
        _teamService = teamService;
    }

    /// <inheritdoc cref="IPermissionHandler{T}.Handle"/>
    public void Handle(IsTeamOwnerPermission permission, IMiddlewareContext middleware, AuthorizationHandlerContext context)
    {
        // Retrieve the id of the authenticated user
        var idClaim = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (idClaim is null || !Guid.TryParse(idClaim.Value, out var userId))
            return;

        // Retrieve the id of the team
        if (!middleware.GetValue<Guid>(permission.Identifier, out var teamId) || !teamId.HasValue)
            return;

        // Retrieve the team
        var team = _teamService.Get(teamId);
        
        // Check if the authenticated user is the owner of the team
        if (team.Owner.UserId != userId)
            return;
        
        context.Succeed(permission);
    }
}