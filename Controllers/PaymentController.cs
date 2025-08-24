using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;    // FirstOrDefaultAsync için
using System.Threading.Tasks;
using System;
using X.Data;                           // AppDbContext'in olduğu namespace
using X.Models;                         // Odeme ve alt sınıfların olduğu namespace (varsa)

namespace X.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OdemelerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OdemelerController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{schoolNo}/{ay}")]
        public async Task<IActionResult> GetOdeme(string schoolNo, string ay)
        {
            if (string.IsNullOrEmpty(schoolNo) || string.IsNullOrEmpty(ay))
                return BadRequest("Okul numarası ve ay parametreleri gereklidir.");

            Odeme odeme = ay.ToLower() switch
            {
                "eylul" => await _context.Odemeler_Eylul.FirstOrDefaultAsync(o => o.SchoolNo == schoolNo),
                "ekim" => await _context.Odemeler_Ekim.FirstOrDefaultAsync(o => o.SchoolNo == schoolNo),
                "kasim" => await _context.Odemeler_Kasim.FirstOrDefaultAsync(o => o.SchoolNo == schoolNo),
                "aralik" => await _context.Odemeler_Aralik.FirstOrDefaultAsync(o => o.SchoolNo == schoolNo),
                "ocak" => await _context.Odemeler_Ocak.FirstOrDefaultAsync(o => o.SchoolNo == schoolNo),
                "subat" => await _context.Odemeler_Subat.FirstOrDefaultAsync(o => o.SchoolNo == schoolNo),
                "mart" => await _context.Odemeler_Mart.FirstOrDefaultAsync(o => o.SchoolNo == schoolNo),
                "nisan" => await _context.Odemeler_Nisan.FirstOrDefaultAsync(o => o.SchoolNo == schoolNo),
                "mayis" => await _context.Odemeler_Mayis.FirstOrDefaultAsync(o => o.SchoolNo == schoolNo),
                _ => null
            };

            if (odeme == null)
                return NotFound("Ödeme kaydı bulunamadı.");

            return Ok(new
            {
                odeme.Tutar,
                OdendiMi = odeme.OdemeDurumu == "Ödendi",
                SonOdemeTarihi = odeme.SonTarih,
                odeme.FullName,
                odeme.StudentClass,
                odeme.Section
            });
        }
    }
}
