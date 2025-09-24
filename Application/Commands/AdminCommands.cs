using CitiWatch.Domain.Entities;
using CitiWatch.Domain.Enums;
using CitiWatch.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace CitiWatch.Application.Commands
{
    public class AdminCommands
    {
        private readonly ApplicationContext _context;

        public AdminCommands(ApplicationContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateAdminAsync(string email, string password, string? fullName = null)
        {
            try
            {
                // Validate inputs
                if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                {
                    Console.WriteLine("❌ Error: Email and password are required.");
                    return false;
                }

                if (!IsValidEmail(email))
                {
                    Console.WriteLine("❌ Error: Invalid email format.");
                    return false;
                }

                if (password.Length < 6)
                {
                    Console.WriteLine("❌ Error: Password must be at least 6 characters long.");
                    return false;
                }

                // Check if admin with this email already exists
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == email && !u.IsDeleted);

                if (existingUser != null)
                {
                    Console.WriteLine($"❌ Error: User with email '{email}' already exists.");
                    return false;
                }

                // Create admin user
                var admin = new User
                {
                    Id = Guid.NewGuid(),
                    FullName = fullName ?? "System Administrator",
                    Email = email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                    Role = UserRole.Admin,
                    Createdon = DateTime.UtcNow,
                    LastModifiedOn = DateTime.UtcNow,
                    IsDeleted = false
                };

                await _context.Users.AddAsync(admin);
                await _context.SaveChangesAsync();

                Console.WriteLine("✅ Admin user created successfully!");
                Console.WriteLine($"   📧 Email: {email}");
                Console.WriteLine($"   👤 Name: {admin.FullName}");
                Console.WriteLine($"   🔑 Role: {admin.Role}");
                Console.WriteLine($"   📅 Created: {admin.Createdon:yyyy-MM-dd HH:mm:ss}");

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error creating admin: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> ListAdminsAsync()
        {
            try
            {
                var admins = await _context.Users
                    .Where(u => u.Role == UserRole.Admin && !u.IsDeleted)
                    .OrderBy(u => u.Createdon)
                    .ToListAsync();

                if (!admins.Any())
                {
                    Console.WriteLine("ℹ️  No admin users found in the database.");
                    return true;
                }

                Console.WriteLine($"👑 Found {admins.Count} admin user(s):");
                Console.WriteLine();

                foreach (var admin in admins)
                {
                    Console.WriteLine($"📧 Email: {admin.Email}");
                    Console.WriteLine($"👤 Name: {admin.FullName}");
                    Console.WriteLine($"🆔 ID: {admin.Id}");
                    Console.WriteLine($"📅 Created: {admin.Createdon:yyyy-MM-dd HH:mm:ss}");
                    Console.WriteLine("─────────────────────────────────────");
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error listing admins: {ex.Message}");
                return false;
            }
        }

        public static void ShowHelp()
        {
            Console.WriteLine("🏛️  CitiWatch Admin Management CLI");
            Console.WriteLine();
            Console.WriteLine("Usage:");
            Console.WriteLine("  dotnet run -- create-admin --email=<email> --password=<password> [--name=<full-name>]");
            Console.WriteLine("  dotnet run -- list-admins");
            Console.WriteLine("  dotnet run -- --help");
            Console.WriteLine();
            Console.WriteLine("Commands:");
            Console.WriteLine("  create-admin    Create a new admin user");
            Console.WriteLine("  list-admins     List all existing admin users");
            Console.WriteLine("  --help          Show this help message");
            Console.WriteLine();
            Console.WriteLine("Examples:");
            Console.WriteLine("  dotnet run -- create-admin --email=admin@citiwatch.com --password=SecurePass123");
            Console.WriteLine("  dotnet run -- create-admin --email=admin@citiwatch.com --password=SecurePass123 --name=\"John Doe\"");
            Console.WriteLine("  dotnet run -- list-admins");
            Console.WriteLine();
            Console.WriteLine("Requirements:");
            Console.WriteLine("  • Email must be valid format");
            Console.WriteLine("  • Password must be at least 6 characters");
            Console.WriteLine("  • Email must be unique in the system");
        }

        private static bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}