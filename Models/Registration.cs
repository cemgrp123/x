using System;
using System.ComponentModel.DataAnnotations;

namespace PaymentBackend.Models
{
    public class Registration
    {
        [Key]
        public int RegistrationId { get; set; }

        [Required]
        [MaxLength(4)]
        public string SchoolNo { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public string StudentClass { get; set; }

        [Required]
        public string Section { get; set; }

        [Required]
        public string ParentName { get; set; }

        [Required]
        [Phone]
        public string ParentContact { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public DateTime RegistrationDate { get; set; } = DateTime.Now;

        public string ProfilePhotoPath { get; set; }
    }
}
