namespace LisoLanches.Dtos.Response
{
    public class OrderDetailResponse
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalPrice { get; set; }
        public List<OrderDetailItemResponse> Items { get; set; } = new();
    }
}
