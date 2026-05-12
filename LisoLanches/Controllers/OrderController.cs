using LisoLanches.Dtos.Request;
using LisoLanches.Models;
using LisoLanches.Services;
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
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder(OrderCreateRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var order = await _orderService.PlaceOrderAsync(userId!, request);

        if (order == null)
            return BadRequest("Could not create order. Items may be invalid.");

        return Ok(order);
    }

    [HttpGet("my-history")]
    public async Task<IActionResult> GetHistory()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        var orders = await _orderService.GetUserOrdersAsync(userId!);

        // Manual mapping to Response DTO would go here
        return Ok(orders);
    }

    [HttpGet("{orderId:int}")]
    public async Task<IActionResult> GetOrderById(int orderId)
    {
        var order = await _orderService.GetUserOrdersAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = order.FirstOrDefault(o => o.OrderId == orderId);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{orderId:int}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] OrderStatus newStatus)
    {
        var updated = await _orderService.UpdateStatusAsync(orderId, newStatus);
        if (!updated) return NotFound();
        return NoContent();
    }

    [HttpDelete("{orderId:int}")]
    public async Task<IActionResult> DeleteOrder(int orderId)
    {
        var deleted = await _orderService.DeleteOrderAsync(orderId);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
