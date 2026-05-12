using LisoLanches.Dtos.Request;
using LisoLanches.Models;

namespace LisoLanches.Repository;

public interface IOrderRepository
{
    Task<Order?> CreateOrderAsync(string userId, List<OrderItemRequest> requestedItems);
    Task<List<Order>> GetUserOrdersAsync(string userId);
    Task UpdateStatusAsync(int orderId, OrderStatus newStatus);
    Task<Order?> GetByIdAsync(int id);
    Task AddOrderAsync(Order order);
    Task<List<Item>> GetAvailableItemsByIdsAsync(List<int> itemIds);
    Task DeleteOrderAsync(int orderId);
}
