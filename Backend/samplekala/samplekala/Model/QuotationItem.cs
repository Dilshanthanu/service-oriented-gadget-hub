using System.ComponentModel.DataAnnotations.Schema;

namespace samplekala.Model
{
    [Table("QuotationItems")]
    public class QuotationItem
    {
        public int Id { get; set; }
        public int QuotationId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal OfferedUnitPrice { get; set; } // Can be negotiated

        public Product Product { get; set; }
    }
}
