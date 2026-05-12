using System.ComponentModel.DataAnnotations;

namespace LisoLanches.Models;

public enum OrderStatus
{
    Pending,    
    Preparing,  
    Ready,      
    Completed,  
    Cancelled
}

public class Order
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public decimal TotalPrice { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    [Required]
    public string UserId { get; set; } = string.Empty;
    public Users User { get; set; } = null!;

    public List<OrderItem> OrderItems { get; set; } = new();
}
