using LisoLanches.Dtos.Request;
using LisoLanches.Repository;
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
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var result = await _userRepo.RegisterAsync(request);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return Ok("User registered successfully");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var response = await _userRepo.LoginAsync(request);
        if (response == null) return Unauthorized("Invalid email or password");
        return Ok(response);
    }
}
