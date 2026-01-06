using System.ComponentModel.DataAnnotations.Schema;

namespace samplekala.Model
{
    [Table("OrderItems")]
    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; }   // ✅ ADD THIS

        public int ProductId { get; set; }
        public Product Product { get; set; }

        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

}
