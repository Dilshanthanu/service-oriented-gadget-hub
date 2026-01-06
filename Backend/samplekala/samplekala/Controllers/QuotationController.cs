    using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using samplekala.Model;
using samplekala.Service;
using System.Security.Claims;

namespace samplekala.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class QuotationController : ControllerBase
    {
        private readonly QuotationService _quotationService;

        public QuotationController(QuotationService quotationService)
        {
            _quotationService = quotationService;
        }

        // 1. CUSTOMER: Convert current cart into a formal Quotation Request
        [HttpPost("request-from-cart")]
        public async Task<IActionResult> RequestQuotation()
        {
            var userId = GetUserId();
            try
            {
                var quotation = await _quotationService.RequestQuoteFromCart(userId);
                return Ok(new { message = "Quotation requested successfully", quotationId = quotation.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // 2. CUSTOMER: View my own quotation history
        [HttpGet("my-quotations")]
        public async Task<IActionResult> GetMyQuotations()
        {
            var userId = GetUserId();
            var quotes = await _quotationService.GetCustomerQuotations(userId);
            return Ok(quotes);
        }

        // 3. DISTRIBUTOR: View all pending requests from customers
        [Authorize(Roles = "Distributor,Admin")]
        [HttpGet("pending-requests")]
        public async Task<IActionResult> GetPendingRequests()
        {
            // You can implement a method in the service to get all quotes with 'Pending' status
            var distributorId = GetUserId();
            var quotes = await _quotationService.GetDistributorQuotations(distributorId);
            return Ok(quotes);
        }

        // 4. DISTRIBUTOR: Approve a quote and set final negotiated prices
        [Authorize(Roles = "Distributor,Admin")]
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> ApproveQuotation(int id, [FromBody] List<QuotationItemUpdateDto> updates)
        {
            try
            {
                await _quotationService.ApproveAndPriceQuotation(id, updates);
                return Ok(new { message = "Quotation approved and sent to customer." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Helper method to extract User ID from JWT Claim
        private int GetUserId()
        {
            var idClaim = User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(idClaim)) throw new UnauthorizedAccessException("User ID not found in token");
            return int.Parse(idClaim);
        }
    }

    // DTO for Distributor to update prices during approval
    public class QuotationItemUpdateDto
    {
        public int ProductId { get; set; }
        public decimal NegotiatedPrice { get; set; }
    }
}
