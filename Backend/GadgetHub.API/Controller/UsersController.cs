using GadgetHub.API.DTO.Req;
using GadgetHub.API.Services;

namespace GadgetHub.API.Controller
{
    [ApiController]
    [Route("api/[controller]")] // URL: api/users
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterRequest request)
        {
            var result = await _userService.RegisterUserAsync(request);

            if (result == null)
            {
                return BadRequest(new { message = "Registration failed. Email may already be in use." });
            }

            return Ok(result);
        }
    }
}
