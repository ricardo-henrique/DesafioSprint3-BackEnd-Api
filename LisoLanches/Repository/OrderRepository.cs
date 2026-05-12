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

    public async Task<List<Item>> GetAvailableItemsByIdsAsync(List<int> itemIds)
       => await _context.Items.Where(i => itemIds.Contains(i.Id) && i.IsAvailable).ToListAsync();

    public async Task AddOrderAsync(Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Order>> GetUserOrdersAsync(string userId)
        => await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Item)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

    public async Task<Order?> GetByIdAsync(int id)
        => await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Item)
            .FirstOrDefaultAsync(o => o.Id == id);

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();

    public async Task UpdateStatusAsync(int orderId, OrderStatus newStatus)
    {
        var order = await _context.Orders.FindAsync(orderId);
        if (order != null)
        {
            order.Status = newStatus;
            await _context.SaveChangesAsync();
        }
    }

    public Task<Order?> CreateOrderAsync(string userId, List<OrderItemRequest> requestedItems)
    {
        throw new NotImplementedException();
    }

    public async Task DeleteOrderAsync(int orderId)
    {
        var order = await _context.Orders.FindAsync(orderId);
        if (order != null)
        {
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
        }
    }
}
