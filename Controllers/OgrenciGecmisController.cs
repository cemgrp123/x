using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using X.Data; // ← senin DbContext burada
using System.Linq;
using System.Threading.Tasks;

namespace X.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OgrenciGecmisController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OgrenciGecmisController(AppDbContext context)
        {
            _context = context;
        }

        // Giriş Geçmişi
        [HttpGet("{okulNo}/gecisler")]
        public async Task<IActionResult> GetGecisler(int okulNo)
        {
            var gecisler = await _context.Gecisler
                .Where(x => x.OkulNo == okulNo)
                .OrderByDescending(x => x.Tarih)
                .Select(x => new
                {
                    x.Tarih,
                    x.Zaman
                }).ToListAsync();

            return Ok(gecisler);
        }

        // Onaylı Raporlar
        [HttpGet("{okulNo}/raporlar")]
        public async Task<IActionResult> GetRaporlar(int okulNo)
        {
            var raporlar = await _context.RaporIstekleri
                .Where(r => r.OkulNo == okulNo && r.Durum == 1)
                .OrderByDescending(r => r.Tarih)
                .Select(r => new
                {
                    Tarih = r.Tarih.ToString("yyyy-MM-dd"), // string olarak yyyy-MM-dd formatında
                    r.RaporNedeni
                })
                .ToListAsync();

            return Ok(raporlar);
        }

    }
}
