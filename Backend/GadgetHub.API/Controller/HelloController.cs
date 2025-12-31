namespace GadgetHub.API.Controller
{
    using Microsoft.AspNetCore.Mvc;

    [ApiController]
    [Route("api/[controller]")]
    public class HelloController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Hello, Kahara! Your .NET backend is running 🚀");
        }
    }
}
