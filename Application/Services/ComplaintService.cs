using CitiWatch.Application.DTOs;
using CitiWatch.Application.Helper;
using CitiWatch.Application.Interfaces;
using CitiWatch.Domain.Entities;
using CitiWatch.Infrastructure.Context;
using CitiWatch.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

namespace CitiWatch.Application.Services
{
    public class ComplaintService(ApplicationContext context, ValidatorHelper validatorHelper, CloudinaryService cloudinaryService) : IComplaintService
    {
        private readonly ApplicationContext _context = context;
        private readonly ValidatorHelper _validatorHelper = validatorHelper;
        private readonly CloudinaryService _cloudinaryService = cloudinaryService;
        public async Task<BaseResponse<IEnumerable<ComplaintResponseDto>>> GetAll()
        {
            var response = new BaseResponse<IEnumerable<ComplaintResponseDto>>();
            var complaints = await _context.Complaints.Include(c => c.Category)
               .Include(c => c.Status).ToListAsync();

            if (!complaints.Any())
            {
                response.Message = "No complaints found";
                return response;
            }

            response.Data = [..complaints.Select(c => new ComplaintResponseDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                CategoryName = c.Category?.Name,
                StatusName = c.Status?.Name,
                Latitude = c.Latitude,
                Longitude = c.Longitude,
                MediaUrl = c.MediaUrl,
                CreatedOn = c.Createdon
            })];
            response.Status = true;
            response.Message = "Success";
            return response;
        }

        public async Task<BaseResponse<ComplaintResponseDto>> GetById(Guid id)
        {
            var response = new BaseResponse<ComplaintResponseDto>();

            var complaint = await _context.Complaints.Include(c => c.Category)
               .Include(c => c.Status).FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);
            if (complaint is null)
            {
                response.Message = "Not found!";
                return response;
            }

            response.Data = new ComplaintResponseDto
            {
                Id = complaint.Id,
                Title = complaint.Title,
                Description = complaint.Description,
                CategoryName = complaint.Category?.Name,
                StatusName = complaint.Status?.Name,
                Latitude = complaint.Latitude,
                Longitude = complaint.Longitude,
                MediaUrl = complaint.MediaUrl,
                CreatedOn = complaint.Createdon
            };
            response.Message = "Success";
            response.Status = true;
            return response;
        }

        public async Task<BaseResponse<IEnumerable<ComplaintResponseDto>>> GetAllUserComplaints()
        {
            var response = new BaseResponse<IEnumerable<ComplaintResponseDto>>();

            var userId = _validatorHelper.GetUserId();
            if (userId == Guid.Empty)
            {
                response.Message = "User not found";
                return response;
            }

            var complaints = await _context.Complaints.Where(c => c.UserId == userId && !c.IsDeleted).Include(c => c.Category)
               .Include(c => c.Status).ToListAsync();
            if (!complaints.Any())
            {
                response.Message = "Not found!";
                return response;
            }

            response.Data = [..complaints.Select(c => new ComplaintResponseDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                CategoryName = c.Category?.Name,
                StatusName = c.Status?.Name,
                Latitude = c.Latitude,
                Longitude = c.Longitude,
                MediaUrl = c.MediaUrl,
                CreatedOn = c.Createdon
            })];
            response.Message = "Success";
            response.Status = true;
            return response;
        }

        public async Task<BaseResponse<ComplaintCreateDto>> Submit(ComplaintCreateDto createDto, IFormFile formFile)
        {
            var response = new BaseResponse<ComplaintCreateDto>();

            var status = await _context.Statuses.FirstOrDefaultAsync(s => s.Name == "Submitted");
            if (status is null)
            {
                response.Message = "Status not found";
                return response;
            }

            string? mediaUrl = null;
            if (formFile != null)
            {
                try
                {

                    mediaUrl = await _cloudinaryService.UploadFileAsync(formFile);

                }
                catch (ArgumentException ex)
                {
                    response.Message = $"File upload error: {ex.Message}";
                    return response;
                }
            }

            var complaint = new Complaint
            {
                Title = createDto.Title,
                Description = createDto.Description,
                UserId = _validatorHelper.GetUserId(),
                CategoryId = createDto.CategoryId,
                StatusId = status.Id,
                Latitude = createDto.Latitude,
                Longitude = createDto.Longitude,
                MediaUrl = mediaUrl
            };

            await _context.Complaints.AddAsync(complaint);
            await _context.SaveChangesAsync();

            response.Message = "Success";
            response.Status = true;
            return response;
        }

        public async Task<BaseResponse<ComplaintResponseDto>> UpdateStatus(Guid complaintId, ComplaintStatusUpdateDto statusDto)
        {
            var response = new BaseResponse<ComplaintResponseDto>();

            var complaint = await _context.Complaints.FindAsync(complaintId);
            if (complaint is null)
            {
                response.Message = "Complaint not found";
                return response;
            }

            complaint.StatusId = statusDto.Id;
            complaint.LastModifiedOn = DateTime.UtcNow;
            complaint.LastModifiedBy = _validatorHelper.GetUserId();
            await _context.SaveChangesAsync();

            response.Message = "Success";
            response.Status = true;
            return response;
        }
    }
}