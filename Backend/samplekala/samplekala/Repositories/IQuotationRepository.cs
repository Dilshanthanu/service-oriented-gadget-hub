using samplekala.Model;

namespace samplekala.Repositories
{
    public interface IQuotationRepository
    {
        Task<Quotation> CreateQuotationAsync(Quotation quotation);
        Task<Quotation?> GetByIdAsync(int id);
        Task<List<Quotation>> GetByCustomerIdAsync(int customerId);
        Task<List<Quotation>> GetByDistributorIdAsync(int distributorId);
        Task UpdateStatusAsync(int id, QuotationStatus status);
        Task<List<Quotation>> GetAllByStatusAsync(QuotationStatus status);
    }
}
