namespace samplekala.DTO
{
    public class AdminRegisterDTO
    {
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        // Security check for creating new admins
       // public string AdminStaffCode { get; set; } = string.Empty;
    }
}
