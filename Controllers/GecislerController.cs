using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using X.Data;
using X.Models;
using System;
using Microsoft.EntityFrameworkCore;



namespace X.Controllers
{
    [ApiController]
    [Route("api/gecisler")]
    public class GecislerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GecislerController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> GecisleriKaydet([FromBody] List<Gecis> gecisler)
        {
            if (gecisler == null || !gecisler.Any())
                return BadRequest("Boş veri gönderildi.");

            try
            {
                await _context.Gecisler.AddRangeAsync(gecisler);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Geçişler başarıyla kaydedildi." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Sunucu hatası oluştu.", error = ex.Message });
            }
        }
        [HttpGet]
        public async Task<IActionResult> TumGecisler()
        {
            try
            {
                var gecisler = await _context.Gecisler
                    .OrderByDescending(g => g.Tarih)
                    .ToListAsync();

                return Ok(gecisler);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Sunucu hatası oluştu.", error = ex.Message });
            }
        }

        // DELETE: /api/gecisler?okulNo=...&tarih=...&zaman=...
        [HttpDelete]
        public async Task<IActionResult> GecisSil([FromQuery] int okulNo, [FromQuery] string tarih, [FromQuery] string zaman)
        {
            try
            {
                // Composite key ile kaydı bul
                var gecis = await _context.Gecisler
                    .FirstOrDefaultAsync(g => g.OkulNo == okulNo
                                           && g.Tarih == tarih
                                           && g.Zaman == zaman);

                if (gecis == null)
                    return NotFound("Kayıt bulunamadı.");

                _context.Gecisler.Remove(gecis);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Kayıt silindi." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Silme sırasında hata oluştu.", error = ex.Message });
            }
        }





    }
}
