namespace samplekala.Model
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }

        public int DistributorId { get; set; } // The distributor who provides this product

        public string Category { get; set; } = "General";

        // Store the path to the image here (e.g., "/images/iphone15.jpg")
        public string? ImageUrl { get; set; }

        public int StockQuantity { get; set; }
    }
}
