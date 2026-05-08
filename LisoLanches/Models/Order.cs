namespace LisoLanches.Models;

public class Order
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalPrice { get; set; }

    public List<OrderItem> OrderItems { get; set; } = new();
}
