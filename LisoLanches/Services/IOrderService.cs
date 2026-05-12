using LisoLanches.Dtos.Request;
using LisoLanches.Dtos.Response;
using LisoLanches.Models;

namespace LisoLanches.Services;

public interface IOrderService
{
    Task<OrderSummaryResponse?> PlaceOrderAsync(string userId, OrderCreateRequest request);
    Task<bool> UpdateStatusAsync(int orderId, OrderStatus newStatus);
    Task<List<OrderSummaryResponse>> GetUserOrdersAsync(string userId);
    Task<bool> DeleteOrderAsync(int orderId);
}
