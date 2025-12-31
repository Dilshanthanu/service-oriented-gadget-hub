namespace GadgetHub.API.DTO.Res
{
    public class UserResponse
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        // Notice: No PasswordHash or CreatedAt here for security.
    }
}
