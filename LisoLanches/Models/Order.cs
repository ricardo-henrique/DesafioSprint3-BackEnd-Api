using System.ComponentModel.DataAnnotations;

namespace LisoLanches.Models;

public class Order
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public decimal TotalPrice { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;

    public List<OrderItem> OrderItems { get; set; } = new();
}
