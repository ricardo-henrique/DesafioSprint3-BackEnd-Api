using LisoLanches.Dtos.Request;
using LisoLanches.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LisoLanches.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly IOrderRepository _orderRepo;

    public OrderController(IOrderRepository orderRepo)
    {
        _orderRepo = orderRepo;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder(OrderCreateRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var order = await _orderRepo.CreateOrderAsync(userId, request.Items);

        if (order == null)
            return BadRequest("Could not create order. Items may be invalid.");

        return Ok(new { order.Id, order.TotalPrice });
    }

    [HttpGet("my-history")]
    public async Task<IActionResult> GetHistory()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var orders = await _orderRepo.GetUserOrdersAsync(userId!);

        // Manual mapping to Response DTO would go here
        return Ok(orders);
    }
}
