using Microsoft.EntityFrameworkCore;
using samplekala.Data;
using samplekala.DTO;
using samplekala.Model;

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
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var quote = await _context.Quotations
                    .Include(q => q.Items)
                    .FirstOrDefaultAsync(q => q.Id == quotationId && q.CustomerId == userId);

                if (quote == null)
                    throw new Exception("Quotation not found.");

                if (quote.Status != QuotationStatus.Approved)
                    throw new Exception("Quotation is not approved.");

                var order = new Order
                {
                    CustomerId = userId,
                    OrderDate = DateTime.Now,
                    FromQuotationId = quote.Id,
                    Status = "Processing",
                    TotalAmount = quote.Items.Sum(i => i.Quantity * i.OfferedUnitPrice)
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync(); // 🔑 generates Order.Id

                var orderItems = quote.Items.Select(i => new OrderItem
                {
                    OrderId = order.Id,            // ✅ FIX
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    UnitPrice = i.OfferedUnitPrice
                }).ToList();

                _context.OrderItems.AddRange(orderItems);

                quote.Status = QuotationStatus.ConvertedToOrder;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return order;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<List<OrderDto>> GetAllOrdersDto()
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    FromQuotationId = o.FromQuotationId,
                    Items = o.OrderItems.Select(oi => new OrderItemDto
                    {
                        ProductId = oi.ProductId,
                        ProductName = oi.Product.Name,
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice
                    }).ToList()
                })
                .ToListAsync();
        }

        public async Task<OrderDto?> GetOrderByIdDto(int id)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Where(o => o.Id == id)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    FromQuotationId = o.FromQuotationId,
                    Items = o.OrderItems.Select(oi => new OrderItemDto
                    {
                        ProductId = oi.ProductId,
                        ProductName = oi.Product.Name,
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice
                    }).ToList()
                })
                .FirstOrDefaultAsync();
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

        public async Task<List<OrderDto>> GetOrdersByCustomer(int customerId)
        {
            return await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    FromQuotationId = o.FromQuotationId,
                    Items = o.OrderItems.Select(oi => new OrderItemDto
                    {
                        ProductId = oi.ProductId,
                        ProductName = oi.Product.Name,
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice
                    }).ToList()
                })
                .ToListAsync();
        }


    }
}
