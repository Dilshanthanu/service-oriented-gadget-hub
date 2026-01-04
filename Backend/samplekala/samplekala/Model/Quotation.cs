using System.ComponentModel.DataAnnotations.Schema;

namespace samplekala.Model
{
   
    public enum QuotationStatus { Pending, Approved, Rejected, ConvertedToOrder }

    [Table("Quotations")]
    public class Quotation
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int DistributorId { get; set; } // The person who provides the quote
        public DateTime ExpiryDate { get; set; }
        public QuotationStatus Status { get; set; } = QuotationStatus.Pending;
        public decimal GrandTotal { get; set; }

        // Navigation
        public List<QuotationItem> Items { get; set; } = new();
    }
}
