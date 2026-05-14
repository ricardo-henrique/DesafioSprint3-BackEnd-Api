using LisoLanches.Dtos.Request;
using LisoLanches.Dtos.Response;
using Microsoft.AspNetCore.Identity;

namespace LisoLanches.Repository;

public interface IUserRepository
{
    Task<IdentityResult> RegisterAsync(RegisterRequest request);
    Task<IdentityResult> RegisterAdminAsync(RegisterRequest request);
    Task<AuthResponse?> LoginAsync(LoginRequest request);
    Task<bool> AddRoleToUserAsync(string userId, string role);
    Task<bool> RemoveRoleFromUserAsync(string userId, string role);
    Task<List<object>> GetAllUsersWithRolesAsync();
}
