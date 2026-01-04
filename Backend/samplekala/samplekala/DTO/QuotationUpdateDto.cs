namespace samplekala.DTO
{
    public class QuotationUpdateDto
    {
        public int QuotationId { get; set; }
        public List<ItemPriceUpdateDto> Items { get; set; }
    }
}
