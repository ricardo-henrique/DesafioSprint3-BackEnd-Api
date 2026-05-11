using LisoLanches.Dtos.Request;
using LisoLanches.Models;

namespace LisoLanches.Repository;

public interface IOrderRepository
{
    Task<Order?> CreateOrderAsync(string userId, List<OrderItemRequest> requestedItems);
    Task<List<Order>> GetUserOrdersAsync(string userId);
}
