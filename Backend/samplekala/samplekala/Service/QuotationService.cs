using Microsoft.EntityFrameworkCore;
using samplekala.Data;
using samplekala.DTO;
using samplekala.Model;
using samplekala.Repositories;

namespace samplekala.Service
{
    public class QuotationService
    {
        private readonly IQuotationRepository _repo;
        private readonly AppDbContext _context;

        public QuotationService(IQuotationRepository repo, AppDbContext context)
        {
            _repo = repo;
            _context = context;
        }

        public async Task<Quotation> RequestQuoteFromCart(int userId)
        {
            var cartItems = await _context.CartItems
                .Where(c => c.UserId == userId)
                .Include(c => c.Product)
                .ToListAsync();

            if (!cartItems.Any()) throw new Exception("Cart is empty");
var distributorId = cartItems.First().Product.DistributorId;

if (cartItems.Any(c => c.Product.DistributorId != distributorId))
{
    throw new Exception("Cart contains products from multiple distributors");
}
            var quotation = new Quotation
            {
                CustomerId = userId,
                DistributorId = distributorId, // Assign the distributor based on cart items
                ExpiryDate = DateTime.Now.AddDays(7),
                Status = QuotationStatus.Pending,
                Items = cartItems.Select(c => new QuotationItem
                {
                    ProductId = c.ProductId,
                    Quantity = c.Quantity,
                    OfferedUnitPrice = c.Product.Price
                }).ToList()
            };

            var result = await _repo.CreateQuotationAsync(quotation);

            // Clear cart after conversion to Quote
            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return result;
        }

        // MOVED INSIDE THE CLASS: Get quotes for a specific customer
        public async Task<List<Quotation>> GetCustomerQuotations(int userId)
        {
            return await _repo.GetByCustomerIdAsync(userId);
        }

        public async Task<QuotationResponseDto> GetQuotationDetails(int id)
        {
            var quote = await _repo.GetByIdAsync(id);
            if (quote == null) return null;

            return new QuotationResponseDto
            {
                Id = quote.Id,
                Status = quote.Status.ToString(),
                ExpiryDate = quote.ExpiryDate,
                Items = quote.Items.Select(i => new QuotationItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Quantity = i.Quantity,
                    PriceAtQuote = i.OfferedUnitPrice
                }).ToList(),
                GrandTotal = quote.Items.Sum(i => i.Quantity * i.OfferedUnitPrice)
            };
        }

        public async Task<List<Quotation>> GetDistributorQuotations(int distributorId)
        {
            return await _repo.GetByDistributorIdAsync(distributorId);
        }
        public async Task<List<Quotation>> GetAllPendingQuotations()
        {
            return await _repo.GetAllByStatusAsync(QuotationStatus.Pending);
        }


        // MOVED INSIDE THE CLASS: Approval logic where distributor sets final prices
        public async Task ApproveAndPriceQuotation(int quoteId, List<samplekala.Controllers.QuotationItemUpdateDto> updates)
        {
            var quote = await _repo.GetByIdAsync(quoteId);
            if (quote == null) throw new Exception("Quotation not found");

            foreach (var update in updates)
            {
                var item = quote.Items.FirstOrDefault(i => i.ProductId == update.ProductId);
                if (item != null)
                {
                    item.OfferedUnitPrice = update.NegotiatedPrice;
                }
            }

            // This status change signals to the customer that the price is ready
            await _repo.UpdateStatusAsync(quoteId, QuotationStatus.Approved);
        }
    } // Ensure this bracket closes the class
} // Ensure this bracket closes the namespace