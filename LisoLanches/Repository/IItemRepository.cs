using LisoLanches.Models;

namespace LisoLanches.Repository;

public interface IItemRepository
{
    Task<Item?> GetByIdAsync(int id);
    Task<List<Item>> GetAllAsync();
    Task<Item> CreateAsync(Item item);
    Task<Item?> UpdateAsync(int id, Item item);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}
