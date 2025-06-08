
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.IO;
using X.Data; // AppDbContext buradan geliyor
using X.Models; // Student modeli buradan geliyor
using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;






[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IWebHostEnvironment _env;

    public ProfileController(AppDbContext dbContext, IWebHostEnvironment env)
    {
        _dbContext = dbContext;
        _env = env;
    }

    // Öğrenci profilini getir
    [HttpGet("{schoolNo:int}")]
    public IActionResult GetProfileBySchoolNo(int schoolNo)
    {
        var student = _dbContext.Students.FirstOrDefault(s => s.SchoolNo == schoolNo);

        if (student == null)
        {
            return NotFound(new { message = "Kullanıcı bulunamadı" });
        }

        return Ok(new
        {
            student.SchoolNo,
            student.FullName,
            student.StudentClass,
            student.Section,
            student.ParentName,
            student.ParentContact,
            student.Email,
            student.ProfilePhotoPath
        });
    }

    // Öğrenci profilini güncelle
    [HttpPut("{schoolNo:int}")]
    public async Task<IActionResult> UpdateProfile(int schoolNo, [FromForm] Student updatedStudent, IFormFile profilePhoto)
    {
        var student = _dbContext.Students.FirstOrDefault(s => s.SchoolNo == schoolNo);
        if (student == null)
            return NotFound(new { message = "Kullanıcı bulunamadı" });

        // Verileri güncelle
        student.FullName = updatedStudent.FullName ?? student.FullName;
        student.StudentClass = updatedStudent.StudentClass != 0 ? updatedStudent.StudentClass : student.StudentClass;
        student.Section = updatedStudent.Section ?? student.Section;
        student.ParentName = updatedStudent.ParentName ?? student.ParentName;
        student.ParentContact = updatedStudent.ParentContact ?? student.ParentContact;
        student.Email = updatedStudent.Email ?? student.Email;

        // Fotoğrafı kaydet
        if (profilePhoto != null && profilePhoto.Length > 0)
        {
            string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(profilePhoto.FileName);
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await profilePhoto.CopyToAsync(fileStream);
            }

            student.ProfilePhotoPath = $"/uploads/{uniqueFileName}";
        }

        _dbContext.SaveChanges();

        return NoContent();
    }

    // Profil fotoğrafı yükleme
    [HttpPost("{schoolNo:int}/photo")]
    public IActionResult UploadProfilePhoto(int schoolNo, [FromForm] IFormFile profilePhoto)
    {
        var student = _dbContext.Students.FirstOrDefault(s => s.SchoolNo == schoolNo);
        if (student == null)
            return NotFound(new { message = "Kullanıcı bulunamadı" });

        if (profilePhoto == null || profilePhoto.Length == 0)
            return BadRequest(new { message = "Geçersiz dosya" });

        // Fotoğrafı kaydetme
        var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
        Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{schoolNo}_{Guid.NewGuid()}{Path.GetExtension(profilePhoto.FileName)}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            profilePhoto.CopyTo(stream);
        }

        // Fotoğraf yolunu güncelle
        student.ProfilePhotoPath = $"/uploads/{fileName}";
        _dbContext.SaveChanges();

        return Ok(new { Path = student.ProfilePhotoPath });
    }
    // Kantin durumu getir (Aylık Hak, Kullanılan Hak, Rapor Hakkı)
    [HttpGet("{schoolNo:int}/durum")]
    public IActionResult GetKantinDurumu(int schoolNo)
    {
        var durum = _dbContext.KantinDurumlari.FirstOrDefault(d => d.SchoolNo == schoolNo);

        if (durum == null)
            return NotFound(new { message = "Kantin durumu bulunamadı" });

        return Ok(new
        {
            AylikHak = durum.AylikHak,
            KullanilanHak = durum.KullanilanHak,
            RaporHak = durum.RaporHak
        });
    }










}
