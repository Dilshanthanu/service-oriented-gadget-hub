using GadgetHub.API.Enum;

namespace GadgetHub.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Internal data that shouldn't be sent to the client directly
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Roles Role { get; set; } = Roles.User;

    }
}
