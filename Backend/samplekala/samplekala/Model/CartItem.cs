using System.ComponentModel.DataAnnotations.Schema;

namespace samplekala.Model
{
    [Table("CartItems")]
    public class CartItem
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        // Navigation properties (helpful for joining data)
        public Product? Product { get; set; }
    }
}
