using CitiWatch.Application.DTOs;
using CitiWatch.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CitiWatch.Host.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComplaintController(IComplaintService complaintService) : ControllerBase
    {
        private readonly IComplaintService _complaintService = complaintService;

        [HttpGet("GetAll")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> GetAll()
        {
            var response = await _complaintService.GetAll();
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpGet("GetAllUserComplaints")]
        [Authorize(Roles ="User")]
        public async Task<IActionResult> GetAllUserComplaints()
        {
            var response = await _complaintService.GetAllUserComplaints();
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpGet("GetById/{id}")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var response = await _complaintService.GetById(id);
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpPost("Submit")]
        [Authorize(Roles ="User")]
        public async Task<IActionResult> Submit([FromForm] ComplaintCreateDto createDto, IFormFile formFile)
        {
            var response = await _complaintService.Submit(createDto, formFile);
            return response.Status ? Ok(response) : BadRequest(response);
        }

        [HttpPut("UpdateStatus/{id}")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> UpdateStatus([FromRoute] Guid id,ComplaintStatusUpdateDto statusDto)
        {
            var response = await _complaintService.UpdateStatus(id, statusDto);
            return response.Status ? Ok(response) : BadRequest(response);
        }
    }
}
