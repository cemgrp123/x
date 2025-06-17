using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using X.Data;
using X.Models;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace X.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RaporIstekleriController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RaporIstekleriController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateRaporIstek([FromBody] RaporIstekleri rapor)
        {
            if (rapor == null)
                return BadRequest("Geçersiz veri.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                rapor.Zaman = DateTime.Now;
                _context.RaporIstekleri.Add(rapor);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Rapor isteği kaydedildi." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Sunucu hatası: " + ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RaporIstekleri>>> GetRaporIstekleri()
        {
            return await _context.RaporIstekleri
                                 .OrderByDescending(r => r.Tarih)
                                 .ThenByDescending(r => r.Zaman)
                                 .ToListAsync();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDurum(int id, [FromBody] UpdateDurumDto updateDto)
        {
            var rapor = await _context.RaporIstekleri.FindAsync(id);
            if (rapor == null)
                return NotFound(new { message = "Rapor isteği bulunamadı." });

            rapor.Durum = (byte)updateDto.Durum;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Durum güncellendi." });
        }

    }
}

// Controller dışına al, ayrı dosyada veya aynı dosyada namespace içinde olabilir
public class UpdateDurumDto
{
    public int Durum { get; set; }
}
