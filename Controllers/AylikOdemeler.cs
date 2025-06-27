using Microsoft.AspNetCore.Mvc;
using System.Linq;
using X.Data; // <-- kendi context'in ismi ile değiştir
using Microsoft.EntityFrameworkCore;

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

        [HttpGet]
        public IActionResult GetOgrenciOzet(int schoolNo, int yil, int ay)
        {
            var ozet = _context.Vw_OgrenciOdemeleriAtlamali
                .Where(x => x.SchoolNo == schoolNo && x.Yil == yil && x.Ay == ay)
                .Select(x => new
                {
                    aylikUcret = x.AylikUcret,
                    oncekiAyKantinHarcamasi = x.OncekiAyKantinHarcamasi,
                    oncekiAyRaporHakkiTutari = x.OncekiAyRaporHakkiTutari,
                    hesaplananGenelOdeme = x.HesaplananGenelOdeme
                })
                .FirstOrDefault();

            if (ozet == null)
                return NotFound(new { message = "Kayıt bulunamadı." });

            return Ok(ozet);
        }

    }
}
