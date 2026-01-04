using Microsoft.EntityFrameworkCore;
using samplekala.Data;
using samplekala.Enums;
using samplekala.Model;

namespace samplekala.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> UserExists(string email)
        {
            return await _context.Users.AnyAsync(x => x.Email == email);
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> AddUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }
        public async Task<List<User>> GetStaffUsers()
        {
            return await _context.Users
                .Where(u => u.Role == UserRole.Admin || u.Role == UserRole.Distributor)
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();
        }
    }
}
