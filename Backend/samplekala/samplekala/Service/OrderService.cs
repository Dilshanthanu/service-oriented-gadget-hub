using samplekala.Data;
using samplekala.Model;
using Microsoft.EntityFrameworkCore;

namespace samplekala.Service
{
    public class OrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Order> PlaceOrderFromQuotation(int quotationId, int userId)
        {
            // 1. Fetch the quotation with its items
            var quote = await _context.Quotations
                .Include(q => q.Items)
                .FirstOrDefaultAsync(q => q.Id == quotationId && q.CustomerId == userId);

            if (quote == null) throw new Exception("Quotation not found.");
            if (quote.Status != QuotationStatus.Approved) throw new Exception("Quotation is not approved yet.");

            // 2. Create the Order object
            var order = new Order
            {
                CustomerId = userId,
                OrderDate = DateTime.Now,
                FromQuotationId = quote.Id,
                TotalAmount = quote.Items.Sum(i => i.Quantity * i.OfferedUnitPrice),
                OrderItems = quote.Items.Select(i => new OrderItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    UnitPrice = i.OfferedUnitPrice
                }).ToList()
            };

            // 3. Save Order and Update Quotation Status
            _context.Orders.Add(order);
            quote.Status = QuotationStatus.ConvertedToOrder;

            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<List<Order>> GetAllOrders()
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ToListAsync();
        }

        public async Task<Order?> GetOrderById(int id)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task UpdateOrderStatus(int id, string newStatus)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) throw new Exception("Order not found");

            order.Status = newStatus;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) throw new Exception("Order not found");

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
        }
    }
}
