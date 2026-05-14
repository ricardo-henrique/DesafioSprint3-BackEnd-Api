namespace LisoLanches.Dtos.Response
{
    public class OrderSummaryResponse
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalPrice { get; set; }
        public int TotalItems { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
