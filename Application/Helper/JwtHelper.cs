using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace CitiWatch.Application.Helper
{
    public class JwtHelper(IConfiguration configuration)
    {
        private readonly IConfiguration _configuration = configuration;
        public string GenerateToken(string email, string role, Guid userId, string fullName)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, userId.ToString()),
                new Claim(ClaimTypes.Role, role),
                new Claim(ClaimTypes.Name, fullName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"] ?? Environment.GetEnvironmentVariable("JWT_KEY")
                ?? throw new InvalidOperationException("JWT Key not found in configuration or environment variables")));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
 
            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"] ?? Environment.GetEnvironmentVariable("JWT_ISSUER"),
                audience: _configuration["JwtSettings:Audience"] ?? Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
                claims: claims,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}