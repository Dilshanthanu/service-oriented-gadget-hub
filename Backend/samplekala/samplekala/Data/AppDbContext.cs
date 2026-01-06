using Microsoft.EntityFrameworkCore;
using samplekala.Model;

namespace samplekala.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }

        public DbSet<CartItem> CartItems { get; set; }
       // public object Quotations { get; internal set; }

        public DbSet<Quotation> Quotations { get; set; }
        public DbSet<QuotationItem> QuotationItems { get; set; }

        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

             protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ✅ Order → OrderItems
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ OrderItem → Product
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
