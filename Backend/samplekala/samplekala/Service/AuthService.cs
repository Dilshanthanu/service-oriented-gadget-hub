using Microsoft.IdentityModel.Tokens;
using samplekala.DTO;
using samplekala.Enums;
using samplekala.Model;
using samplekala.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace samplekala.Service
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<string> RegisterCustomer(CustomerRegisterDTO request)
        {
            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Password = request.Password,
                Role = UserRole.Customer
            };

            await _userRepository.AddUser(user);
            return "Customer registration successful";
        }

        public async Task<string> RegisterDistributor(DistributorRegisterDTO request)
        {
            var user = new User
            {
                FirstName = request.FullName,
                LastName = request.FullName,
                Email = request.Email,
                Password = request.Password,
                CompanyName = request.CompanyName,
                Role = UserRole.Distributor
            };

            await _userRepository.AddUser(user);
            return "Distributor registration successful";
        }

        public async Task<string> RegisterAdmin(AdminRegisterDTO request)
        {
            var user = new User
            {
                FirstName = request.UserName,
                LastName = request.UserName,
                Email = request.Email,
                Password = request.Password,
                Role = UserRole.Admin
            };

            await _userRepository.AddUser(user);
            return "Admin registration successful";
        }

        public async Task<User?> Login(LoginDTO request)
        {
            var user = await _userRepository.GetUserByEmail(request.Email);

            if (user == null || user.Password != request.Password)
                return null;

            return user;
        }

        // ✅ NEW STAFF METHOD
        public async Task<List<User>> GetStaffUsers()
        {
            return await _userRepository.GetStaffUsers();
        }

        public string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("Your_Very_Long_Secret_Key_Here_12345")
            );

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
