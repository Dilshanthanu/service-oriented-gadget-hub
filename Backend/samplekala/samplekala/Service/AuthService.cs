using Microsoft.EntityFrameworkCore;
using samplekala.DTO;
using samplekala.Enums;
using samplekala.Model;
using samplekala.Repositories;


namespace samplekala.Service
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // Best Practice: The Service assigns the role based on the specific method called
        public async Task<string> RegisterCustomer(CustomerRegisterDTO request)
        {
            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Password = request.Password,
                Role = UserRole.Customer // Assigned here by the system
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
                Role = UserRole.Distributor // Assigned here by the system
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
                Role = UserRole.Admin // Assigned here by the system
            };
            await _userRepository.AddUser(user);
            return "Admin registration successful";
        }

        public async Task<User?> Login(LoginDTO request)
        {
            // 1. Find the user by email
            var user = await _userRepository.GetUserByEmail(request.Email);

            // 2. Check if user exists and password matches
            if (user == null || user.Password != request.Password)
            {
                return null; // Login failed
            }

            // 3. Return the user (which includes their Role!)
            return user;
        }


    }
}
