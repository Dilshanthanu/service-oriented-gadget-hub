namespace samplekala.DTO
{
    public class ProductDTO
    {
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public int StockQuantity { get; set; }

        public string Category { get; set; } = "General";

        public int DistributorId { get; set; }  

        // This allows the Admin to provide a URL for the image 
        // until we implement the actual file upload logic
        public string? ImageUrl { get; set; }
    }
}
