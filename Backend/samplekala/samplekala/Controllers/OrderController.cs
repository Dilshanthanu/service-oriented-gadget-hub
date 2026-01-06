using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using samplekala.Model;
using samplekala.Service;

namespace samplekala.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrderController(OrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("checkout/{quotationId}")]
        public async Task<IActionResult> Checkout(int quotationId)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value);
            try
            {
                var order = await _orderService.PlaceOrderFromQuotation(quotationId, userId);
                return Ok(new { message = "Order placed successfully!", orderId = order.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // 1. GET ALL ORDERS (Admin Only)
        // 1. GET ALL ORDERS (Admin Only)
        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _orderService.GetAllOrdersDto();
            return Ok(orders);
        }

        // 2. GET ORDER BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _orderService.GetOrderByIdDto(id);
            if (order == null) return NotFound();
            return Ok(order);
        }


        // 3. UPDATE ORDER STATUS (Admin/Distributor)
        [Authorize(Roles = "Admin,Distributor")]
        [HttpPut("update-status/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            try
            {
                await _orderService.UpdateOrderStatus(id, status);
                return Ok(new { message = "Status updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // 4. DELETE ORDER (Admin Only)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _orderService.DeleteOrder(id);
                return Ok(new { message = "Order deleted" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = int.Parse(User.FindFirst("id")?.Value);

            var orders = await _orderService.GetOrdersByCustomer(userId);

            return Ok(orders);
        }
    }   
}
