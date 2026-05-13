using LisoLanches.Dtos.Request;
using LisoLanches.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LisoLanches.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ItemController : ControllerBase
{
    private readonly IItemService _itemService;

    public ItemController(IItemService itemService)
    {
        _itemService = itemService;
    }

    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        var items = await _itemService.GetAllAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
    {
        var item = await _itemService.GetByIdAsync(id);
        if (item == null)
            return NotFound(new { message = "Item not found" });

        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] MenuItemCreateRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var item = await _itemService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, [FromBody] MenuItemCreateRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var item = await _itemService.UpdateAsync(id, request);
        if (item == null)
            return NotFound(new { message = "Item not found" });

        return Ok(item);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var success = await _itemService.DeleteAsync(id);
        if (!success)
            return NotFound(new { message = "Item not found" });

        return NoContent();
    }
}
