using LisoLanches.Dtos.Request;
using LisoLanches.Dtos.Response;
using LisoLanches.Models;
using LisoLanches.Repository;

namespace LisoLanches.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepo;

    public OrderService(IOrderRepository orderRepo)
    {
        _orderRepo = orderRepo;
    }

    public async Task<OrderSummaryResponse?> PlaceOrderAsync(string userId, OrderCreateRequest request)
    {
        var itemIds = request.Items.Select(i => i.ItemId).ToList();
        var menuItems = await _orderRepo.GetAvailableItemsByIdsAsync(itemIds);

        if (!menuItems.Any()) return null;

        var order = new Order
        {
            UserId = userId,
            OrderDate = DateTime.UtcNow,
            OrderItems = new List<OrderItem>()
        };

        decimal runningTotal = 0;

        foreach (var req in request.Items)
        {
            var menuItem = menuItems.FirstOrDefault(m => m.Id == req.ItemId);
            if (menuItem == null) continue;

            var orderItem = new OrderItem
            {
                ItemId = menuItem.Id,
                Quantity = req.Quantity,
                PriceAtPurchase = menuItem.Price
            };

            runningTotal += orderItem.PriceAtPurchase * orderItem.Quantity;
            order.OrderItems.Add(orderItem);
        }

        if (!order.OrderItems.Any()) return null;

        order.TotalPrice = runningTotal;

        await _orderRepo.AddOrderAsync(order);

        return new OrderSummaryResponse
        {
            OrderId = order.Id,
            OrderDate = order.OrderDate,
            TotalPrice = order.TotalPrice,
            TotalItems = order.OrderItems.Sum(oi => oi.Quantity)
        };
    }

    public async Task<List<OrderSummaryResponse>> GetUserOrdersAsync(string userId)
    {
     
        var orders = await _orderRepo.GetUserOrdersAsync(userId);

        
        return orders.Select(o => new OrderSummaryResponse
        {
            OrderId = o.Id,
            OrderDate = o.OrderDate,
            TotalPrice = o.TotalPrice,
            TotalItems = o.OrderItems.Sum(oi => oi.Quantity),
            Status = o.Status.ToString()
        }).ToList();
    }

    public async Task<bool> UpdateStatusAsync(int orderId, OrderStatus newStatus)
    {
        // Business Logic: Only update if the order exists
        var order = await _orderRepo.GetByIdAsync(orderId);
        if (order == null) return false;

        await _orderRepo.UpdateStatusAsync(orderId, newStatus);
        return true;
    }

    public async Task<bool> DeleteOrderAsync(int orderId)
    {
        var order = await _orderRepo.GetByIdAsync(orderId);
        if (order == null) return false;
        await _orderRepo.DeleteOrderAsync(orderId);
        return true;
    }
}
