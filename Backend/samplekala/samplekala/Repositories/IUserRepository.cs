using samplekala.Model;

namespace samplekala.Repositories
{
    public interface IUserRepository
    {
        Task<bool> UserExists(string email);
        Task<User> AddUser(User user);

        Task<User?> GetUserByEmail(string email); // ADD THIS LINE
       
    }
}
