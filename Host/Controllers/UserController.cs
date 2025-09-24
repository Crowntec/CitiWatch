using CitiWatch.Application.DTOs;
using CitiWatch.Application.Helper;
using CitiWatch.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CitiWatch.Host.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(IUserService userService, JwtHelper jwtHelper) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly JwtHelper _jwtHelper = jwtHelper;

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var response = await _userService.Login(loginDto);
            if (response.Status == false || response.Data == null)
            {
                return BadRequest(response);
            }

            if (response.Data != null)
            {
                var token = _jwtHelper.GenerateToken(response.Data.Email, response.Data.Role.ToString(), response.Data.Id);
                return Ok(new
                {
                    Token = token
                });
            }
            return Unauthorized(response.Message);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(UserCreateDto userDto)
        {
            var response = await _userService.Register(userDto);
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpPost("CreateAdmin")]
        public async Task<IActionResult> CreateAdmin(UserCreateDto userDto)
        {
            var response = await _userService.RegisterAdmin(userDto);
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpPut("Update/{id}")]
        [Authorize]
        public async Task<IActionResult> Update([FromRoute] Guid id, UserUpdateDto userDto)
        {
            var response = await _userService.Update(id, userDto);
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpGet("GetAll")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> GetAll()
        {
            var response = await _userService.GetAll();
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpPost("Delete/{id}")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            var response = await _userService.Delete(id);
            return response.Status ? Ok(response) : BadRequest(response);
        }
    }
}