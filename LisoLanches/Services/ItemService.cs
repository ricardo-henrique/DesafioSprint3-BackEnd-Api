using LisoLanches.Dtos.Request;
using LisoLanches.Dtos.Response;
using LisoLanches.Models;
using LisoLanches.Repository;

namespace LisoLanches.Services;

public class ItemService : IItemService
{
    private readonly IItemRepository _itemRepository;

    public ItemService(IItemRepository itemRepository)
    {
        _itemRepository = itemRepository;
    }

    public async Task<MenuItemResponse?> GetByIdAsync(int id)
    {
        var item = await _itemRepository.GetByIdAsync(id);
        if (item == null) return null;

        return MapToResponse(item);
    }

    public async Task<List<MenuItemResponse>> GetAllAsync()
    {
        var items = await _itemRepository.GetAllAsync();
        return items.Select(MapToResponse).ToList();
    }

    public async Task<MenuItemResponse> CreateAsync(MenuItemCreateRequest request)
    {
        var item = new Item
        {
            Name = request.Name,
            Price = request.Price,
            IsAvailable = true
        };

        var createdItem = await _itemRepository.CreateAsync(item);
        return MapToResponse(createdItem);
    }

    public async Task<MenuItemResponse?> UpdateAsync(int id, MenuItemCreateRequest request)
    {
        var itemExists = await _itemRepository.ExistsAsync(id);
        if (!itemExists) return null;

        var item = new Item
        {
            Name = request.Name,
            Price = request.Price
        };

        var updatedItem = await _itemRepository.UpdateAsync(id, item);
        return updatedItem != null ? MapToResponse(updatedItem) : null;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _itemRepository.DeleteAsync(id);
    }

    private static MenuItemResponse MapToResponse(Item item)
    {
        return new MenuItemResponse
        {
            Id = item.Id,
            Name = item.Name,
            Price = item.Price,
            ImageUrl = item.ImagePath
        };
    }
}
