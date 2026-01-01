

using GadgetHub.API.Models;

namespace GadgetHub.API.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task CreateAsync(User user);
        Task SaveChangesAsync(); // Important for finalizing transactions
    }
}
