namespace samplekala.DTO
{
    public class OrderDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public int? FromQuotationId { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }

}
