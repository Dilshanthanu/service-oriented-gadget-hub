using Microsoft.AspNetCore.Mvc;
using samplekala.DTO;
using samplekala.Service;

namespace samplekala.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }
        [HttpPost("register/customer")]
        public async Task<IActionResult> RegisterCustomer(CustomerRegisterDTO request)
        {
            var result = await _authService.RegisterCustomer(request);
            return Ok(new { message = result });
        }

        [HttpPost("register/distributor")]
        public async Task<IActionResult> RegisterDistributor(DistributorRegisterDTO request)
        {
            var result = await _authService.RegisterDistributor(request);
            return Ok(new { message = result });
        }

        [HttpPost("register/admin")]
        public async Task<IActionResult> RegisterAdmin(AdminRegisterDTO request)
        {
            // You could add a check here for an 'Admin Key' for extra security
            var result = await _authService.RegisterAdmin(request);
            return Ok(new { message = result });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO request)
        {
            var user = await _authService.Login(request);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            // Return useful info to the frontend
            return Ok(new
            {
                message = "Login successful",
                email = user.Email,
                role = user.Role.ToString(), // Tells the frontend if they are "Admin", etc.
                firstName = user.FirstName
            });
        }
    }
}
