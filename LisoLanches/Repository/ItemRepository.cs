using LisoLanches.Data;
using LisoLanches.Models;
using Microsoft.EntityFrameworkCore;

namespace LisoLanches.Repository;

public class ItemRepository : IItemRepository
{
    private readonly AppDbContext _context;

    public ItemRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Item?> GetByIdAsync(int id)
        => await _context.Items.FirstOrDefaultAsync(i => i.Id == id);

    public async Task<List<Item>> GetAllAsync()
        => await _context.Items.ToListAsync();

    public async Task<Item> CreateAsync(Item item)
    {
        _context.Items.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<Item?> UpdateAsync(int id, Item item)
    {
        var existingItem = await _context.Items.FirstOrDefaultAsync(i => i.Id == id);
        if (existingItem == null) return null;

        existingItem.Name = item.Name;
        existingItem.Price = item.Price;
        existingItem.ImagePath = item.ImagePath;
        existingItem.IsAvailable = item.IsAvailable;

        _context.Items.Update(existingItem);
        await _context.SaveChangesAsync();

        return existingItem;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _context.Items.FirstOrDefaultAsync(i => i.Id == id);
        if (item == null) return false;

        _context.Items.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
        => await _context.Items.AnyAsync(i => i.Id == id);
}
