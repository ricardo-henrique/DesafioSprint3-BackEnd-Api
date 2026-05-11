namespace LisoLanches.Models;

public class Item
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImagePath { get; set; }
    public bool IsAvailable { get; set; } = true;

    public List<OrderItem> OrderItems { get; set; } = new();
}
