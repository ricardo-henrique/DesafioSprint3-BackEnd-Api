namespace LisoLanches.Dtos.Response
{
    public class MenuItemResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
    }
}
