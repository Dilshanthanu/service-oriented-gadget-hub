namespace GadgetHub.API.DTO.Res
{
    public class QuotationRes
    {
        public string DistributorName { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public string DeliveryLeadTime { get; set; } = string.Empty;
    }
}
