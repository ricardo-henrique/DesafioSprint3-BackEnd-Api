using LisoLanches.Dtos.Request;
using LisoLanches.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LisoLanches.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepo;

    public AuthController(IUserRepository userRepo) => _userRepo = userRepo;

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _userRepo.RegisterAsync(request);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return Ok(new { message = "User registered successfully" });
    }

    [HttpPost("register-admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RegisterAdmin([FromBody] RegisterRequest request)
    {
        var result = await _userRepo.RegisterAdminAsync(request);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return Ok(new { message = "Admin user registered successfully" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var response = await _userRepo.LoginAsync(request);
        if (response == null) return Unauthorized("Invalid email or password");
        return Ok(response);
    }

    [HttpPost("assign-role/{userId}/{role}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignRole(string userId, string role)
    {
        var success = await _userRepo.AddRoleToUserAsync(userId, role);
        if (!success) return BadRequest("Failed to assign role to user");
        return Ok(new { message = $"Role '{role}' assigned successfully" });
    }

    [HttpPost("remove-role/{userId}/{role}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RemoveRole(string userId, string role)
    {
        var success = await _userRepo.RemoveRoleFromUserAsync(userId, role);
        if (!success) return BadRequest("Failed to remove role from user");
        return Ok(new { message = $"Role '{role}' removed successfully" });
    }

    [HttpGet("users")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userRepo.GetAllUsersWithRolesAsync();
        return Ok(users);
    }
}
