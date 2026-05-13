using LisoLanches.Dtos.Request;
using LisoLanches.Dtos.Response;

namespace LisoLanches.Services;

public interface IItemService
{
    Task<MenuItemResponse?> GetByIdAsync(int id);
    Task<List<MenuItemResponse>> GetAllAsync();
    Task<MenuItemResponse> CreateAsync(MenuItemCreateRequest request);
    Task<MenuItemResponse?> UpdateAsync(int id, MenuItemCreateRequest request);
    Task<bool> DeleteAsync(int id);
}
