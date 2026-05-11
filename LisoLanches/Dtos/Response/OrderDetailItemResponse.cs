namespace LisoLanches.Dtos.Response
{
    public class OrderDetailItemResponse
    {
        public string ItemName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal PriceAtPurchase { get; set; }
        public decimal SubTotal => PriceAtPurchase * Quantity;
    }
}
