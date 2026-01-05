using samplekala.Model;
using samplekala.Repositories;
using samplekala.DTO;

namespace samplekala.Service
{
    public class ProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _productRepository.GetAllProducts();
        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _productRepository.GetProductById(id);
        }

        public async Task<Product> CreateProductAsync(ProductDTO dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                StockQuantity = dto.StockQuantity,
                Category = dto.Category,
                ImageUrl = "default-gadget.png", // We can update this later with actual upload logic
                DistributorId = dto.DistributorId
            };

            await _productRepository.AddProduct(product);
            return product;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var existing = await _productRepository.GetProductById(id);
            if (existing == null) return false;

            await _productRepository.DeleteProduct(id);
            return true;
        }
    }
}
