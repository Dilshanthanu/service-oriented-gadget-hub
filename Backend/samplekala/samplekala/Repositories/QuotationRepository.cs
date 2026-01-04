using samplekala.Data;
using samplekala.Model;
using Microsoft.EntityFrameworkCore;

namespace samplekala.Repositories
{
    public class QuotationRepository : IQuotationRepository
    {
        private readonly AppDbContext _context;
        public QuotationRepository(AppDbContext context) => _context = context;

        public async Task<Quotation> CreateQuotationAsync(Quotation quotation)
        {
            _context.Quotations.Add(quotation);
            await _context.SaveChangesAsync();
            return quotation;
        }

        public async Task<Quotation?> GetByIdAsync(int id) =>
            await _context.Quotations.Include(q => q.Items).ThenInclude(i => i.Product).FirstOrDefaultAsync(q => q.Id == id);

        public async Task<List<Quotation>> GetByCustomerIdAsync(int customerId) =>
            await _context.Quotations.Where(q => q.CustomerId == customerId).Include(q => q.Items).ToListAsync();

        public async Task<List<Quotation>> GetByDistributorIdAsync(int distributorId) =>
            await _context.Quotations.Where(q => q.DistributorId == distributorId).Include(q => q.Items).ToListAsync();

        public async Task UpdateStatusAsync(int id, QuotationStatus status)
        {
            var quote = await _context.Quotations.FindAsync(id);
            if (quote != null) { quote.Status = status; await _context.SaveChangesAsync(); }
        }
    }
    }
