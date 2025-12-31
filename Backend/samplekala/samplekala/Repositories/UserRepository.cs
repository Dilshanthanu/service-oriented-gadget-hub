using Microsoft.EntityFrameworkCore;
using samplekala.Data;
using samplekala.Model;

namespace samplekala.Repositories
{
    public class UserRepository : IUserRepository
    {

        // 1. Declare the private field
        private readonly AppDbContext _context;

        // 2. Inject it through the constructor
        public UserRepository(AppDbContext context)
        {
            _context = context; // Now the class can use '_context' to talk to MySQL
        }
        // Add your DBContext here (e.g., private readonly AppDbContext _context;)

        
        public async Task<bool> UserExists(string email)
        {
            return await _context.Users.AnyAsync(x => x.Email == email);
        }


        public async Task<User?> GetUserByEmail(string email)
        {
            // This searches the Users table for the first record matching the email
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }



        public async Task<User> AddUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync(); // <-- THIS LINE MUST BE HERE
            return user;
        }
    }
}
