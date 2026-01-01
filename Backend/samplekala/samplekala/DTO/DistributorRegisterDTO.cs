namespace samplekala.DTO
{
    public class DistributorRegisterDTO
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        // Specific to the Gadget Hub project requirements
        public string CompanyName { get; set; } = string.Empty;
       // public string TaxId { get; set; } = string.Empty;

    }
}
