using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using X.Data;  // DbContext'in namespace'i
using X.Models; // Model sınıflarının namespace'i

namespace YourNamespace.Controllers
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

        // Dinamik ay için tablo seçimi
        private IQueryable<Odeme> GetOdemelerSet(string ay)
        {
            return ay.ToLower() switch
            {
                "eylul" or "eylül" => _context.Odemeler_Eylul,
                "ekim" => _context.Odemeler_Ekim,
                "kasim" or "kasım" => _context.Odemeler_Kasim,
                "aralik" or "aralık" => _context.Odemeler_Aralik,
                "ocak" => _context.Odemeler_Ocak,
                "subat" or "şubat" => _context.Odemeler_Subat,
                "mart" => _context.Odemeler_Mart,
                "nisan" => _context.Odemeler_Nisan,
                "mayis" or "mayıs" => _context.Odemeler_Mayis,
                _ => null,
            };
        }

        [HttpGet("{ay}")]
        public async Task<IActionResult> GetAy(string ay)
        {
            var set = GetOdemelerSet(ay);
            if (set == null)
                return BadRequest("Geçersiz ay");

            var data = await set.OrderBy(o => o.SonTarih).ToListAsync();
            return Ok(data);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            // Mevcut all metodu aynen kalabilir, senin verdiğin gibi
            var eylul = await _context.Odemeler_Eylul.ToListAsync();
            var ekim = await _context.Odemeler_Ekim.ToListAsync();
            var kasim = await _context.Odemeler_Kasim.ToListAsync();
            var aralik = await _context.Odemeler_Aralik.ToListAsync();
            var ocak = await _context.Odemeler_Ocak.ToListAsync();
            var subat = await _context.Odemeler_Subat.ToListAsync();
            var mart = await _context.Odemeler_Mart.ToListAsync();
            var nisan = await _context.Odemeler_Nisan.ToListAsync();
            var mayis = await _context.Odemeler_Mayis.ToListAsync();

            List<Odeme> combined = new List<Odeme>();

            combined.AddRange(eylul.Select(o => new Odeme
            {
                Id = o.Id,
                SchoolNo = o.SchoolNo,
                FullName = o.FullName,
                StudentClass = o.StudentClass,
                Section = o.Section,
                Tutar = o.Tutar,
                OdemeDurumu = o.OdemeDurumu,
                SonTarih = o.SonTarih
            }));

            combined.AddRange(ekim.Select(o => new Odeme
            {
                Id = o.Id,
                SchoolNo = o.SchoolNo,
                FullName = o.FullName,
                StudentClass = o.StudentClass,
                Section = o.Section,
                Tutar = o.Tutar,
                OdemeDurumu = o.OdemeDurumu,
                SonTarih = o.SonTarih
            }));

            combined.AddRange(kasim.Select(o => new Odeme
            {
                Id = o.Id,
                SchoolNo = o.SchoolNo,
                FullName = o.FullName,
                StudentClass = o.StudentClass,
                Section = o.Section,
                Tutar = o.Tutar,
                OdemeDurumu = o.OdemeDurumu,
                SonTarih = o.SonTarih
            }));

            combined.AddRange(aralik.Select(o => new Odeme
            {
                Id = o.Id,
                SchoolNo = o.SchoolNo,
                FullName = o.FullName,
                StudentClass = o.StudentClass,
                Section = o.Section,
                Tutar = o.Tutar,
                OdemeDurumu = o.OdemeDurumu,
                SonTarih = o.SonTarih
            }));

            combined.AddRange(ocak.Select(o => new Odeme
            {
                Id = o.Id,
                SchoolNo = o.SchoolNo,
                FullName = o.FullName,
                StudentClass = o.StudentClass,
                Section = o.Section,
                Tutar = o.Tutar,
                OdemeDurumu = o.OdemeDurumu,
                SonTarih = o.SonTarih
            }));

            combined.AddRange(subat.Select(o => new Odeme
            {
                Id = o.Id,
                SchoolNo = o.SchoolNo,
                FullName = o.FullName,
                StudentClass = o.StudentClass,
                Section = o.Section,
                Tutar = o.Tutar,
                OdemeDurumu = o.OdemeDurumu,
                SonTarih = o.SonTarih
            }));

            combined.AddRange(mart.Select(o => new Odeme
            {
                Id = o.Id,
                SchoolNo = o.SchoolNo,
                FullName = o.FullName,
                StudentClass = o.StudentClass,
                Section = o.Section,
                Tutar = o.Tutar,
                OdemeDurumu = o.OdemeDurumu,
                SonTarih = o.SonTarih
            }));

            combined.AddRange(nisan.Select(o => new Odeme
            {
                Id = o.Id,
                SchoolNo = o.SchoolNo,
                FullName = o.FullName,
                StudentClass = o.StudentClass,
                Section = o.Section,
                Tutar = o.Tutar,
                OdemeDurumu = o.OdemeDurumu,
                SonTarih = o.SonTarih
            }));

            combined.AddRange(mayis.Select(o => new Odeme
            {
                Id = o.Id,
                SchoolNo = o.SchoolNo,
                FullName = o.FullName,
                StudentClass = o.StudentClass,
                Section = o.Section,
                Tutar = o.Tutar,
                OdemeDurumu = o.OdemeDurumu,
                SonTarih = o.SonTarih
            }));

            combined = combined.OrderBy(o => o.SonTarih).ToList();

            return Ok(combined);
        }

        // Ödeme durumu "Ödendi" olarak güncelleme endpoint'i
        // Durum güncellemek için basit DTO (isteğe bağlı farklı isim verilebilir)
        public class DurumGuncelleModel
        {
            public string OdemeDurumu { get; set; }
        }

        // Controller içinde ödeme durumu güncelleme metodu
        [HttpPost("odeme-ekle/{ay}/{id}")]
        public async Task<IActionResult> OdemeDurumGuncelle(string ay, int id, [FromBody] DurumGuncelleModel model)
        {
            var set = GetOdemelerSet(ay);
            if (set == null)
                return BadRequest("Geçersiz ay");

            var odeme = await set.FirstOrDefaultAsync(o => o.Id == id);
            if (odeme == null)
                return NotFound();

            var gecerliDurumlar = new[] { "Bekliyor", "Gecikmiş", "Ödendi" };
            if (!gecerliDurumlar.Contains(model.OdemeDurumu))
                return BadRequest("Geçersiz durum.");

            odeme.OdemeDurumu = model.OdemeDurumu;
            await _context.SaveChangesAsync();

            return Ok();
        }
        [HttpPost("gecikme-yap/{ay}")]
public async Task<IActionResult> GecikmeYap(string ay)
{
    var set = GetOdemelerSet(ay);  // sadece ilgili ayın tablosu geliyor
    if (set == null)
        return BadRequest("Geçersiz ay");

    var bekleyenOdemeler = await set.Where(o => o.OdemeDurumu.ToLower() == "bekliyor").ToListAsync();
    if (!bekleyenOdemeler.Any())
        return Ok("Bekleyen ödeme yok.");

    foreach (var odeme in bekleyenOdemeler)
    {
        odeme.OdemeDurumu = "Gecikmiş";
    }
    await _context.SaveChangesAsync();

    return Ok("Bekleyen ödemeler gecikmiş yapıldı.");
}



    }
}
