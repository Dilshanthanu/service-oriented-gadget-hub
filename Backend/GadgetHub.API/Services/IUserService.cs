using GadgetHub.API.DTO.Req;
using GadgetHub.API.DTO.Res;

namespace GadgetHub.API.Services
{
    public interface IUserService
    {
        Task<UserResponse?> RegisterUserAsync(UserRegisterRequest request);
    }
}
