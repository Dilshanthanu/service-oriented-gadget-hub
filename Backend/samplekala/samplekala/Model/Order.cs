using System.ComponentModel.DataAnnotations.Schema;

namespace samplekala.Model
{

    [Table("Orders")]
    public class Order
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Processing"; // Processing, Shipped, Delivered, Cancelled
        public int? FromQuotationId { get; set; } // Link back to the source quote

        public List<OrderItem> OrderItems { get; set; } = new();

    }
}
