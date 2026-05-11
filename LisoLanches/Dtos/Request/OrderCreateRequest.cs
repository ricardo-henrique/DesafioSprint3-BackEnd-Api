namespace LisoLanches.Dtos.Request
{
    public class OrderCreateRequest
    {
        public List<OrderItemRequest> Items { get; set; } = new();
    }
}
