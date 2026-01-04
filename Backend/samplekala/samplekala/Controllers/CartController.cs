using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using samplekala.Data;
using samplekala.DTO;
using samplekala.Model;

namespace samplekala.Controllers
{
    [Authorize] // Only logged-in users can have a cart
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddToCart(AddToCartDTO dto)
        {
            // 1. Get User from Token
            var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return Unauthorized();

            // 2. Check if THIS user already has THIS product in their cart
            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == user.Id && c.ProductId == dto.ProductId);

            if (existingItem != null)
            {
                // 3. If it exists, just increase the quantity
                existingItem.Quantity += dto.Quantity;
                _context.CartItems.Update(existingItem);
            }
            else
            {
                // 4. If it's new, create a new row
                var cartItem = new CartItem
                {
                    UserId = user.Id,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity
                };
                _context.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cart updated successfully!" });
        }

        // DELETE: api/Cart/remove/5
        [HttpDelete("remove/{id}")]
        public async Task<IActionResult> RemoveItem(int id)
        {
            var item = await _context.CartItems.FindAsync(id);

            if (item == null) return NotFound("Item not found in cart.");

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Item removed from cart." });
        }

        // DELETE: api/Cart/clear
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            // 1. Identify the user from the JWT
            var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return Unauthorized();

            // 2. Find all rows belonging to this user
            var userItems = _context.CartItems.Where(c => c.UserId == user.Id);

            // 3. Remove the entire range of items
            _context.CartItems.RemoveRange(userItems);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cart cleared successfully." });
        }

        [HttpGet]
        public async Task<IActionResult> GetMyCart()
        {
            // 1. Identify the user from the JWT Token
            var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return Unauthorized();

            // 2. Fetch cart items AND include the Product details (Price, Name)
            var items = await _context.CartItems
                .Where(c => c.UserId == user.Id)
                .Include(c => c.Product)
                .Select(item => new {
                    item.Id,
                    item.ProductId,
                    ProductName = item.Product.Name,
                    UnitPrice = item.Product.Price,
                    Quantity = item.Quantity,
                    LineTotal = item.Quantity * item.Product.Price // Calculate total for this item
                })
                .ToListAsync();

            // 3. Calculate the grand total for the whole cart
            var grandTotal = items.Sum(i => i.LineTotal);

            return Ok(new
            {
                items,
                grandTotal
            });
        }
    }
}
