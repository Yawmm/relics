using System.Security.Claims;
using Backend.Core.Services.Tasks;
using Backend.Policies.Permissions.Extensions;
using Backend.Policies.Permissions.Variants.Tasks;
using HotChocolate.Resolvers;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Policies.Permissions.Handlers.Tasks;

/// <inheritdoc cref="IPermissionHandler{T}"/>
public class IsCommentOwnerPermissionHandler : IPermissionHandler<IsCommentOwnerPermission>
{
    private readonly ICommentService _commentService;
    
    public IsCommentOwnerPermissionHandler(ICommentService commentService)
    {
        _commentService = commentService;
    }
    
    /// <inheritdoc cref="IPermissionHandler{T}.Handle"/>
    public void Handle(IsCommentOwnerPermission permission, IMiddlewareContext middleware, AuthorizationHandlerContext context)
    {
        // Retrieve the id of the authenticated user
        var claim = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (claim is null || !Guid.TryParse(claim.Value, out var ownerId))
            return;

        // Retrieve the id of the comment
        if (!middleware.GetValue<Guid>(permission.Identifier, out var commentId) || !commentId.HasValue)
            return;

        // Retrieve the comment
        var comment = _commentService.Get(commentId);
        
        // Check if the authenticated user is the owner of the comment
        if (comment.Owner.UserId != ownerId)
            return;
        
        context.Succeed(permission);
    }
}