namespace samplekala.Model
{

    using samplekala.Enums;
    public class User
    {
        public int Id { get; set; }

        // Basic Information
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        // Credentials (Essential for the Gadget Hub login)
        public string Email { get; set; } = string.Empty;

        // Security: Never store plain-text passwords
        public string Password { get; set; } = string.Empty;

        // Role-based access (e.g., "Customer" or "Admin")
        public UserRole Role { get; set; } = UserRole.Customer;

        public string? CompanyName { get; set; }

        // Audit fields for Maintainability
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
