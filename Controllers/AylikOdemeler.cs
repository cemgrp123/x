using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using X.Data;
using Microsoft.EntityFrameworkCore;
using X.Models;

namespace X.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OgrenciOzetController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OgrenciOzetController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{schoolNo:int}/{ay}")]
        public async Task<IActionResult> GetOgrenciOzet(int schoolNo, string ay)
        {
            try
            {
                OdemeTablo data = ay.ToLower() switch
                {
                    "eylul" => await _context.Eylul_Hesapla.FirstOrDefaultAsync(x => x.SchoolNo == schoolNo),
                    "ekim" => await _context.Ekim_Hesapla.FirstOrDefaultAsync(x => x.SchoolNo == schoolNo),
                    "kasim" => await _context.Kasim_Hesapla.FirstOrDefaultAsync(x => x.SchoolNo == schoolNo),
                    "aralik" => await _context.Aralik_Hesapla.FirstOrDefaultAsync(x => x.SchoolNo == schoolNo),
                    "ocak" => await _context.Ocak_Hesapla.FirstOrDefaultAsync(x => x.SchoolNo == schoolNo),
                    "subat" => await _context.Subat_Hesapla.FirstOrDefaultAsync(x => x.SchoolNo == schoolNo),
                    "mart" => await _context.Mart_Hesapla.FirstOrDefaultAsync(x => x.SchoolNo == schoolNo),
                    "nisan" => await _context.Nisan_Hesapla.FirstOrDefaultAsync(x => x.SchoolNo == schoolNo),
                    "mayis" => await _context.Mayis_Hesapla.FirstOrDefaultAsync(x => x.SchoolNo == schoolNo),
                    _ => null
                };

                if (data == null)
                    return NotFound(new { message = "Kayıt bulunamadı." });

                return Ok(data);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new { message = "Sunucu hatası", details = ex.Message });
            }
        }
    }
}
