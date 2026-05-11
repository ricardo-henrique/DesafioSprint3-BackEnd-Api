using LisoLanches.Dtos.Request;
using LisoLanches.Dtos.Response;
using Microsoft.AspNetCore.Identity;

namespace LisoLanches.Repository;

public interface IUserRepository
{
    Task<IdentityResult> RegisterAsync(RegisterRequest request);
    Task<AuthResponse?> LoginAsync(LoginRequest request);
}
