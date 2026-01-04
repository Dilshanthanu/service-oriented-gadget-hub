using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using samplekala.DTO;
using samplekala.Service;

namespace samplekala.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductController(ProductService productService)
        {
            _productService = productService;
        }

        // GET: api/product
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
        }

        // GET: api/product/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null) return NotFound("Product not found.");
            return Ok(product);
        }

        // POST: api/product
        // In your report, mention this is restricted to Admins
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(ProductDTO dto)
        {
            var result = await _productService.CreateProductAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // DELETE: api/product/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _productService.DeleteProductAsync(id);
            if (!deleted) return NotFound();
            return Ok(new { message = "Product deleted successfully" });
        }
    }
}
