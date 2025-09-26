using CitiWatch.Application.DTOs;
using CitiWatch.Application.Helper;
using CitiWatch.Application.Interfaces;
using CitiWatch.Domain.Entities;
using CitiWatch.Domain.Enums;
using CitiWatch.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace CitiWatch.Application.Services
{
    public class UserService(ApplicationContext context, ValidatorHelper validatorHelper) : IUserService
    {
        private readonly ApplicationContext _context = context;
        private readonly ValidatorHelper _validatorHelper = validatorHelper;
        public async Task<BaseResponse<bool>> Delete(Guid userId)
        {
            var response = new BaseResponse<bool>();

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId && !x.IsDeleted);
            if (user == null)
            {
                response.Message = "User not found.";
                return response;
            }

            user.IsDeleted = true;
            user.IsDeletedBy = _validatorHelper.GetUserId();
            user.IsDeletedOn = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            response.Data = true;
            response.Message = "User deleted successfully.";
            response.Status = true;

            return response;
        }

        public async Task<BaseResponse<IEnumerable<UserResponseDto>>> GetAll()
        {
            var response = new BaseResponse<IEnumerable<UserResponseDto>>();

            var users = await _context.Users.Where(x => !x.IsDeleted).ToListAsync();
            if (!users.Any())
            {
                response.Message = "No users found.";
                return response;
            }

            response.Data = users.Select(x => new UserResponseDto
            {
                Id = x.Id,
                FullName = x.FullName,
                Email = x.Email,
                Role = x.Role,
                // Handle both default datetime (0001-01-01) and properly set dates
                CreatedOn = x.Createdon == default(DateTime) ? DateTime.UtcNow : x.Createdon,
                // If LastModifiedOn is default/unset, use CreatedOn as fallback
                LastModifiedOn = x.LastModifiedOn == default(DateTime) ? 
                    (x.Createdon == default(DateTime) ? DateTime.UtcNow : x.Createdon) : 
                    x.LastModifiedOn
            });
            response.Status = true;
            response.Message = "Users retrieved successfully.";
            return response;
        }

        public async Task<BaseResponse<UserResponseDto>> Login(LoginDto loginDto)
        {
            var response = new BaseResponse<UserResponseDto>();
            var user = await _context.Users.SingleOrDefaultAsync(x =>
                x.Email == loginDto.Email && !x.IsDeleted);

            if (user is null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                response.Message = "Incorrect Email  or password!";
                return response;
            }

            response.Data = new UserResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                Role = user.Role,
            };
            response.Message = "Welcome";
            response.Status = true;

            return response;
        }

        public async Task<BaseResponse<UserCreateDto>> Register(UserCreateDto userCreateDto)
        {
            var response = new BaseResponse<UserCreateDto>();

            var existingUser = await _context.Users.AnyAsync(x => x.Email == userCreateDto.Email && !x.IsDeleted);
            if (existingUser)
            {
                response.Message = "User already exists.";
                return response;
            }

            var user = new User
            {
                FullName = userCreateDto.FullName,
                Email = userCreateDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userCreateDto.Password),
                Role = UserRole.User,
                CreatedBy = Guid.NewGuid(), // You might want to get this from the current user context
                LastModifiedOn = DateTime.UtcNow,
                LastModifiedBy = Guid.NewGuid() // You might want to get this from the current user context
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            response.Data = userCreateDto;
            response.Message = "User registered successfully.";
            response.Status = true;

            return response;
        }

        public async Task<BaseResponse<UserCreateDto>> RegisterAdmin(UserCreateDto userCreateDto)
        {
            var response = new BaseResponse<UserCreateDto>();

            var existingUser = await _context.Users.AnyAsync(x => x.Email == userCreateDto.Email && !x.IsDeleted);
            if (existingUser)
            {
                response.Message = "User already exists.";
                return response;
            }

            var user = new User
            {
                FullName = userCreateDto.FullName,
                Email = userCreateDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userCreateDto.Password),
                Role = UserRole.Admin,
                CreatedBy = Guid.NewGuid(), // You might want to get this from the current user context
                LastModifiedOn = DateTime.UtcNow,
                LastModifiedBy = Guid.NewGuid() // You might want to get this from the current user context
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            response.Data = userCreateDto;
            response.Message = "User registered successfully.";
            response.Status = true;

            return response;
        }

        public async Task<BaseResponse<bool>> Update(Guid userId, UserUpdateDto userUpdateDto)
        {
            var response = new BaseResponse<bool>();

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId && !x.IsDeleted);
            if (user == null)
            {
                response.Message = "User not found.";
                return response;
            }

            user.FullName = userUpdateDto.FullName;
            user.Email = userUpdateDto.Email;
            user.LastModifiedBy = _validatorHelper.GetUserId();
            user.LastModifiedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            response.Data = true;
            response.Message = "User updated successfully.";
            response.Status = true;

            return response;
        }
    }
}