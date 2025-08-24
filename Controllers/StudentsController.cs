using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using X.Data;
using X.Models;
using Microsoft.AspNetCore.Cors;
using System.Security.Cryptography;
using System.Text;
using System;
using System.Linq;
using System.Collections.Generic;






namespace X.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowAllOrigins")]
    public class StudentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Tüm öğrencileri getir
        [HttpGet]
        public async Task<IActionResult> GetStudents()
        {
            var students = await _context.Students.ToListAsync();
            return Ok(students);
        }

        // ✅ Yeni öğrenci oluştur
        [HttpPost]
        public async Task<IActionResult> CreateStudent([FromBody] Student student)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Şifreyi hashle ve PasswordHash property’sine ata
            student.PasswordHash = ComputeSha256Hash(student.PasswordHash.Trim());

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStudentById), new { id = student.SchoolNo }, student);
        }

        private static string ComputeSha256Hash(string rawData)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));
                StringBuilder builder = new StringBuilder();
                foreach (var b in bytes)
                    builder.Append(b.ToString("x2"));
                return builder.ToString();
            }
        }


        // ✅ Belirli öğrenciyi getir (profil için)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentById(int id)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.SchoolNo == id);
            if (student == null) return NotFound();
            return Ok(student);
        }

        // ✅ Öğrenci güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] Student updatedStudent)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.SchoolNo == id);
            if (student == null) return NotFound();

            student.FullName = updatedStudent.FullName;
            student.PasswordHash = updatedStudent.PasswordHash;
            student.ProfilePhotoPath = updatedStudent.ProfilePhotoPath;

            await _context.SaveChangesAsync();
            return Ok(student);
        }

        // ✅ Giriş (login) kontrolü
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s =>
                s.SchoolNo == request.SchoolNo && s.PasswordHash == request.Password);

            if (student == null) return Unauthorized();

            return Ok(new
            {
                student.SchoolNo,
                student.FullName,
                student.ProfilePhotoPath
            });
        }
        [HttpDelete("{schoolNo}")]
        public async Task<IActionResult> DeleteStudent(int schoolNo)
        {
            try
            {
                var student = await _context.Students.FindAsync(schoolNo);
                if (student == null)
                    return NotFound();

                // Önce ilişkili kayıtları sil (KantinDurumlari)
                var kantinDurum = await _context.KantinDurumlari.FindAsync(schoolNo);
                if (kantinDurum != null)
                    _context.KantinDurumlari.Remove(kantinDurum);

                // İstersen KantinHarcamalari da sil
                var harcamalar = _context.KantinHarcamalari.Where(k => k.SchoolNo == schoolNo);
                _context.KantinHarcamalari.RemoveRange(harcamalar);

                await _context.SaveChangesAsync();

                // Sonra öğrenci kaydını sil
                _context.Students.Remove(student);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPut("guncelle-hepsi/{id}")]
        public async Task<IActionResult> UpdateStudentAndDurum(int id, [FromBody] OgrenciGuncelleDTO model)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.SchoolNo == id);
            var durum = await _context.KantinDurumlari.FirstOrDefaultAsync(k => k.SchoolNo == id);

            if (student == null || durum == null) return NotFound();

            // Öğrenci bilgilerini güncelle
            student.FullName = model.FullName;
            student.StudentClass = model.StudentClass;
            student.Section = model.Section;
            student.ParentName = model.ParentName;
            student.ParentContact = model.ParentContact;

            // Kantin hak bilgilerini güncelle
            durum.AylikHak = model.AylikHak;
            durum.KullanilanHak = model.KullanilanHak;
            durum.RaporHak = model.RaporHak;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Öğrenci ve hak bilgileri güncellendi." });
        }
        [HttpPost("{id}/raporhak/artir")]
        public async Task<IActionResult> RaporHakArtir(int id)
        {
            var durum = await _context.KantinDurumlari.FindAsync(id);
            if (durum == null) return NotFound();

            durum.RaporHak += 1;
            await _context.SaveChangesAsync();
            return Ok(durum);
        }

        [HttpPost("{id}/raporhak/azalt")]
        public async Task<IActionResult> RaporHakAzalt(int id)
        {
            var durum = await _context.KantinDurumlari.FindAsync(id);
            if (durum == null || durum.RaporHak <= 0) return BadRequest();

            durum.RaporHak -= 1;
            await _context.SaveChangesAsync();
            return Ok(durum);
        }
        [HttpPost("kullanilanhak/sifirla")]
        public async Task<IActionResult> TumKullanilanHaklariSifirla()
        {
            var durumlar = await _context.KantinDurumlari.ToListAsync();

            foreach (var durum in durumlar)
            {
                durum.KullanilanHak = 0;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Tüm kullanılan haklar sıfırlandı." });
        }
      [HttpGet("payment-info/{ay}")]
public async Task<IActionResult> GetPaymentInfo(string ay)
{
    // Ay adını case-insensitive olarak sorgula
    var ayBilgisi = await _context.AylikTutarlar
        .Where(a => a.Ay.ToLower() == ay.ToLower())
        .Select(a => new
        {
            a.GunSayisi,
            a.GunlukUcret,
            a.ToplamUcret,
            SonOdemeTarihi = a.SonOdemeTarihi.ToString("yyyy-MM-dd")
        })
        .FirstOrDefaultAsync();

    if (ayBilgisi == null)
        return NotFound();

    return Ok(ayBilgisi);
}


        [HttpPut("activate/{schoolNo}")]
        public async Task<IActionResult> ToggleAktifDurum(string schoolNo)
        {
            if (!int.TryParse(schoolNo, out int parsedSchoolNo))
                return BadRequest("Okul numarası geçersiz.");

            var ogrenci = await _context.Students.FirstOrDefaultAsync(s => s.SchoolNo == parsedSchoolNo);
            if (ogrenci == null)
                return NotFound();

            ogrenci.IsActive = !ogrenci.IsActive;
            await _context.SaveChangesAsync();

            return Ok(new { ogrenci.SchoolNo, ogrenci.IsActive });
        }


        public class IsActiveDto
        {
            public bool IsActive { get; set; }
        }



        public class ActivateDto
        {
            public bool IsActive { get; set; }
        }




    }

}

// DTO: Giriş için küçük model
public class LoginRequest
{
    public int SchoolNo { get; set; }
    public string Password { get; set; }
}

