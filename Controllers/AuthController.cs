using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using X.Models; // Student modeli burada
using Microsoft.EntityFrameworkCore;
using X.Data;
using System;

namespace X.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
                return BadRequest("Kullanıcı adı veya şifre boş olamaz.");

            // Okul numarasını int'e çevir
            if (!int.TryParse(request.Username, out int schoolNo))
                return BadRequest("Geçersiz okul numarası.");

            // Kullanıcıyı bul
            var user = await _context.Students.FirstOrDefaultAsync(s => s.SchoolNo == schoolNo);
            if (user == null)
                return Unauthorized("Kullanıcı bulunamadı.");

            // Şifreyi hashle
            string hashedPassword = ComputeSha256Hash(request.Password.Trim());

            // Null kontrolü yap ve trim et
            var storedHash = user.PasswordHash?.Trim();

            // Hash karşılaştırması - büyük/küçük harf duyarsız
            if (string.IsNullOrEmpty(storedHash) || 
                !string.Equals(storedHash, hashedPassword, StringComparison.OrdinalIgnoreCase))
            {
                return Unauthorized("Şifre yanlış.");
            }

            // Giriş başarılı, kullanıcı bilgilerini dön
            return Ok(new
            {
                schoolNo = user.SchoolNo,
                fullName = user.FullName,
                studentClass = user.StudentClass,
                section = user.Section,
                profilePhoto = user.ProfilePhotoPath
            });
        }

        private static string ComputeSha256Hash(string rawData)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));
                StringBuilder builder = new StringBuilder();
                foreach (var b in bytes)
                   builder.Append(b.ToString("X2")); // büyük harf

                return builder.ToString();
            }
        }
    }

    public class LoginRequestDto
    {
        public string Username { get; set; }  // Okul numarası (string olarak geliyor)
        public string Password { get; set; }
    }
}
