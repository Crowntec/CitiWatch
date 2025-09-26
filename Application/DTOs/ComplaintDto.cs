using System.ComponentModel.DataAnnotations;

namespace CitiWatch.Application.DTOs
{
    public class ComplaintCreateDto
    {
        [StringLength(200, MinimumLength = 5)]
        public string Title { get; set; } = string.Empty;

        [StringLength(2000, MinimumLength = 10)]
        public string Description { get; set; } = string.Empty;

        public Guid CategoryId { get; set; }

        public string? Latitude { get; set; }

        public string? Longitude { get; set; }
    }

    public class ComplaintUpdateDto
    {
        [StringLength(200, MinimumLength = 5)]
        public string? Title { get; set; }

        [StringLength(2000, MinimumLength = 10)]
        public string? Description { get; set; }

        public Guid? CategoryId { get; set; }

        public Guid? StatusId { get; set; }

        public string? Latitude { get; set; }

        public string? Longitude { get; set; }

        public string? MediaUrl { get; set; }
    }

    public class ComplaintResponseDto
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? CategoryName { get; set; }
        public string? StatusName { get; set; }
        public string? UserName { get; set; }
        public string? UserEmail { get; set; }
        public string? Latitude { get; set; }
        public string? Longitude { get; set; }
        public string? MediaUrl { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime LastModifiedOn { get; set; }
    }
}
