namespace LisoLanches.Dtos.Request
{
    public class MenuItemCreateRequest
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public IFormFile? ImageFile { get; set; }
        public bool IsAvailable { get; set; } = true;
    }
}
