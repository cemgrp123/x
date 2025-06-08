using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using X.Data;
using System.Collections.Generic;


namespace X.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("ayliktutarlar")]
        public IActionResult GetAylikTutarlar(string ay)
        {
            if (string.IsNullOrEmpty(ay))
                return BadRequest("Ay parametresi gereklidir.");

            if (ay.Length != 7) // "yyyy-MM"
                return BadRequest("Ay parametresi geçersiz formatta.");

            string ayNumarasi = ay.Substring(5, 2);

            var aylar = new Dictionary<string, string> {
        { "09", "Eylül" }, { "10", "Ekim" }, { "11", "Kasım" }, { "12", "Aralık" },
        { "01", "Ocak" }, { "02", "Şubat" }, { "03", "Mart" }, { "04", "Nisan" },
        { "05", "Mayıs" }
    };

            if (!aylar.ContainsKey(ayNumarasi))
                return BadRequest("Ay numarası geçersiz.");

            string ayAdi = aylar[ayNumarasi];

            var data = _context.AylikTutarlar
                .Where(x => x.Ay.Trim().ToLower() == ayAdi.ToLower())
                .Select(x => new
                {
                    x.Ay,
                    x.ToplamUcret,
                    x.SonOdemeTarihi
                })
                .FirstOrDefault();

            if (data == null)
                return NotFound("Veri bulunamadı.");

            string durum = data.SonOdemeTarihi < DateTime.Today ? "Geçti" : "Beklemede";

            return Ok(new
            {
                nextPaymentMonth = data.Ay,
                paymentAmount = $"{data.ToplamUcret} TL",
                paymentStatus = durum,
                paymentDate = data.SonOdemeTarihi.ToString("yyyy-MM-dd")
            });
        }



    }
}
