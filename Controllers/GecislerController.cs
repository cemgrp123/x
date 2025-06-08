using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using X.Data;
using X.Models;
using System;


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

    }
}
