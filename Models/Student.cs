using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;


namespace X.Models
{
    public class Student
    {
        [Key]

        public int SchoolNo { get; set; }
        public string FullName { get; set; }
        public int StudentClass { get; set; }
        public string Section { get; set; }
        public string ParentName { get; set; }
        public string ParentContact { get; set; }
        public string Email { get; set; }
         public bool IsActive { get; set; } = false;
        public string PasswordHash { get; set; }
        public string ProfilePhotoPath { get; set; }
         public ICollection<KantinHarcamasi> KantinHarcamalari { get; set; }

        public KantinDurumlari KantinDurumlari { get; set; }
    }
}
