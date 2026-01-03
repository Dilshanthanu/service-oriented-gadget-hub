using samplekala.Model;

namespace samplekala.Repositories
{
    public interface IProductRepository
    {
        // Get all products (For Customers to browse)
        Task<IEnumerable<Product>> GetAllProducts();

        // Get a single product (For Product Details page)
        Task<Product?> GetProductById(int id);

        // Add a new product (Admin feature)
        Task AddProduct(Product product);

        // Update existing product (Admin feature - e.g., change price or stock)
        Task UpdateProduct(Product product);

        // Delete a product (Admin feature)
        Task DeleteProduct(int id);

        // Save changes to the database
        Task<bool> SaveChanges();
    }
}
