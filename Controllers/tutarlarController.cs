using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using X.Data; // Burada EF context'in yer aldığı namespace

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AylikTutarlarController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AylikTutarlarController(AppDbContext context)
        {
            _context = context;
        }

        // TÜM VERİLERİ GETİR
        [HttpGet]
        public IActionResult GetAll()
        {
            var liste = _context.AylikTutarlar.OrderBy(x => x.SonOdemeTarihi).ToList();
            return Ok(liste);
        }

        // YENİ KAYIT EKLE
        [HttpPost]
        public IActionResult Add([FromBody] AylikTutarlar yeni)
        {
            if (yeni == null) return BadRequest();

            _context.AylikTutarlar.Add(yeni);
            _context.SaveChanges();

            return Ok(new { message = "Eklendi", id = yeni.Id });
        }

        // GÜNCELLE
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] AylikTutarlar guncel)
        {
            var kayit = _context.AylikTutarlar.FirstOrDefault(x => x.Id == id);
            if (kayit == null) return NotFound();

            kayit.Ay = guncel.Ay;
            kayit.GunSayisi = guncel.GunSayisi;
            kayit.GunlukUcret = guncel.GunlukUcret;
            kayit.SonOdemeTarihi = guncel.SonOdemeTarihi;

            _context.SaveChanges();
            return Ok(new { message = "Güncellendi" });
        }

        // SİL
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var kayit = _context.AylikTutarlar.FirstOrDefault(x => x.Id == id);
            if (kayit == null) return NotFound();

            _context.AylikTutarlar.Remove(kayit);
            _context.SaveChanges();
            return Ok(new { message = "Silindi" });
        }
        [HttpPost("insertmultiple")]
        public IActionResult InsertMultiple([FromBody] List<AylikTutarlar> yeniListe)
        {
            if (yeniListe == null || !yeniListe.Any())
                return BadRequest();

            foreach (var item in yeniListe)
            {
                var kayit = _context.AylikTutarlar.FirstOrDefault(x => x.Id == item.Id);
                if (kayit != null)
                {
                    kayit.Ay = item.Ay;
                    kayit.GunSayisi = item.GunSayisi;
                    kayit.GunlukUcret = item.GunlukUcret;
                    kayit.SonOdemeTarihi = item.SonOdemeTarihi;
                }
                else
                {
                    _context.AylikTutarlar.Add(item);
                }
            }

            _context.SaveChanges();
            return Ok(new { message = "Tüm veriler güncellendi" });
        }
        [HttpGet("by-ay/{ay}")]
        public IActionResult GetByAy(string ay)
        {
            var result = _context.AylikTutarlar
                .Where(a => a.Ay.ToLower() == ay.ToLower())
                .Select(a => new
                {
                    a.GunSayisi,
                    a.GunlukUcret,
                    a.ToplamUcret,
                    a.SonOdemeTarihi
                })
                .FirstOrDefault();

            if (result == null)
                return NotFound();

            return Ok(result);
        }



    }


}
