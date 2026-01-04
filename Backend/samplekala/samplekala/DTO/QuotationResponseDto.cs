namespace samplekala.DTO
{
    public class QuotationResponseDto
    {
        public int Id { get; set; }
        public string Status { get; set; }
        public DateTime ExpiryDate { get; set; }
        public decimal GrandTotal { get; set; }
        public List<QuotationItemDto> Items { get; set; }
    }
}
