using GadgetHub.API.DTO.Req;
using GadgetHub.API.DTO.Res;
using GadgetHub.API.Models;
using GadgetHub.API.Repositories;

namespace GadgetHub.API.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserResponse?> RegisterUserAsync(UserRegisterRequest request)
        {
            // 1. Business Logic: Check if user already exists
            var existingUser = await _userRepository.GetByEmailAsync(request.Email);
            if (existingUser != null) return null;

            // 2. Map DTO to Entity
            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = request.Password, // Remember to add BCrypt later!
                Role = UserRole.Customer
            };

            // 3. Use Repository to save to MySQL
            await _userRepository.CreateAsync(user);

            // 4. Map Entity back to Response DTO (Best practice: hide the password)
            return new UserResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString()
            };
        }
        }
}
