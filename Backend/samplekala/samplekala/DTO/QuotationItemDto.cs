namespace samplekala.DTO
{
    public class QuotationItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal PriceAtQuote { get; set; }
        public decimal LineTotal => Quantity * PriceAtQuote;
    }
}
