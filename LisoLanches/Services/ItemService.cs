using LisoLanches.Dtos.Request;
using LisoLanches.Dtos.Response;
using LisoLanches.Models;
using LisoLanches.Repository;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace LisoLanches.Services;

public class ItemService : IItemService
{
    private readonly IItemRepository _itemRepository;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public ItemService(IItemRepository itemRepository, IWebHostEnvironment webHostEnvironment)
    {
        _itemRepository = itemRepository;
        _webHostEnvironment = webHostEnvironment;
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

    private async Task<string?> SaveImageAsync(IFormFile? imageFile)
    {
        if (imageFile == null || imageFile.Length == 0)
            return null;

        var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var uniqueFileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await imageFile.CopyToAsync(fileStream);
        }

        return $"/images/{uniqueFileName}";
    }

    public async Task<MenuItemResponse> CreateAsync(MenuItemCreateRequest request)
    {
        var imagePath = await SaveImageAsync(request.ImageFile);

        var item = new Item
        {
            Name = request.Name,
            Price = request.Price,
            IsAvailable = request.IsAvailable,
            ImagePath = imagePath
        };

        var createdItem = await _itemRepository.CreateAsync(item);
        return MapToResponse(createdItem);
    }

    public async Task<MenuItemResponse?> UpdateAsync(int id, MenuItemCreateRequest request)
    {
        var existingItem = await _itemRepository.GetByIdAsync(id);
        if (existingItem == null) return null;

        string? imagePath = existingItem.ImagePath;
        if (request.ImageFile != null)
        {
            imagePath = await SaveImageAsync(request.ImageFile);
        }

        var item = new Item
        {
            Name = request.Name,
            Price = request.Price,
            IsAvailable = request.IsAvailable,
            ImagePath = imagePath
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
            ImageUrl = item.ImagePath,
            IsAvailable = item.IsAvailable
        };
    }
}
