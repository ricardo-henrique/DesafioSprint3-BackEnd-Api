using Microsoft.EntityFrameworkCore;
using LisoLanches.Data;
using LisoLanches.Dtos.Request;
using LisoLanches.Models;

namespace LisoLanches.Repository;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Order?> CreateOrderAsync(string userId, List<OrderItemRequest> requestedItems)
    {
       
        var itemIds = requestedItems.Select(i => i.ItemId).ToList();
        var menuItems = await _context.Items
            .Where(i => itemIds.Contains(i.Id) && i.IsAvailable).ToListAsync();

        if (!menuItems.Any()) return null;

        
        var order = new Order
        {
            UserId = userId,
            OrderDate = DateTime.UtcNow,
            OrderItems = new List<OrderItem>()
        };

        decimal runningTotal = 0;

       
        foreach (var req in requestedItems)
        {
            var menuItem = menuItems.FirstOrDefault(m => m.Id == req.ItemId);
            if (menuItem == null) continue;

            var orderItem = new OrderItem
            {
                ItemId = menuItem.Id,
                Quantity = req.Quantity,
                PriceAtPurchase = menuItem.Price 
            };

            runningTotal += (orderItem.PriceAtPurchase * orderItem.Quantity);
            order.OrderItems.Add(orderItem);
        }

        order.TotalPrice = runningTotal;

        
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return order;
    }

    public async Task<List<Order>> GetUserOrdersAsync(string userId)
    {
        return await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Item)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();
    }
}
