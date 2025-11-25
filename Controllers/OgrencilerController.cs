#nullable enable

using Microsoft.AspNetCore.Mvc;
using System.Linq;
using X.Data;
using X.Models;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;



namespace X.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OgrencilerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OgrencilerController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ogrenciler
        [HttpGet]
        public IActionResult GetOgrenciler()
        {
            try
            {
                var ogrenciler = (from s in _context.Students
                                  join k in _context.KantinDurumlari
                                  on s.SchoolNo equals k.SchoolNo into kantinGroup
                                  from kantin in kantinGroup.DefaultIfEmpty()
                                  select new
                                  {
                                      s.SchoolNo,
                                      s.FullName,
                                      s.StudentClass,
                                      s.Section,
                                      s.ParentName,
                                      s.ParentContact,
                                      s.IsActive, // buraya ekle,
                                      AylikHak = kantin != null ? kantin.AylikHak : 0,
                                      KullanilanHak = kantin != null ? kantin.KullanilanHak : 0,
                                      RaporHak = kantin != null ? kantin.RaporHak : 0,
                                      OdenecekTutar = kantin != null ? kantin.OdenecekTutar : 0m
                                  }).ToList();

                return Ok(ogrenciler);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // POST: api/ogrenciler/tumOgrencilereAylikHak
        [HttpPost("tumOgrencilereAylikHak")]
        public IActionResult TumOgrencilereAylikHakGuncelle([FromBody] int aylikHak)
        {
            try
            {
                var tumOgrenciler = _context.Students.ToList();
                var mevcutDurumlar = _context.KantinDurumlari.ToList();

                foreach (var ogrenci in tumOgrenciler)
                {
                    var durum = mevcutDurumlar.FirstOrDefault(k => k.SchoolNo == ogrenci.SchoolNo);

                    if (durum != null)
                    {
                        // Zaten varsa güncelle
                        durum.AylikHak = aylikHak;
                    }
                    else
                    {
                        // Yoksa yeni kayıt oluştur
                        _context.KantinDurumlari.Add(new KantinDurumlari
                        {
                            SchoolNo = ogrenci.SchoolNo,
                            AylikHak = aylikHak,
                            KullanilanHak = 0,
                            RaporHak = 0,
                            OdenecekTutar = 0
                        });
                    }
                }

                _context.SaveChanges();

                return Ok(new { message = "Tüm öğrencilerin aylık hakları güncellendi veya eklendi." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Sunucu hatası: " + ex.Message });
            }
        }
        // GET: api/ogrenciler/ozet
        [HttpGet("ozet")]
        public IActionResult GetOgrenciOzet()
        {
            try
            {
                var ozet = _context.Students
                    .Select(s => new
                    {
                        s.SchoolNo,
                        s.FullName,
                        s.StudentClass,
                        s.Section
                    })
                    .ToList();

                return Ok(ozet);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [HttpGet("{schoolNo:int}")]
        public IActionResult GetStudentBySchoolNo(int schoolNo)
        {
            var student = _context.Students
                .Where(s => s.SchoolNo == schoolNo)
                .Select(s => new
                {
                    okulNo = s.SchoolNo,
                    adSoyad = s.FullName,
                    sinif = s.StudentClass,
                    sube = s.Section,
                    isActive = s.IsActive
                })
                .FirstOrDefault();

            if (student == null)
                return NotFound();

            return Ok(student);
        }

        [HttpGet("raporlu")]
        public async Task<IActionResult> GetRaporluOgrenciler(string? date)
        {
            DateTime tarih;
            if (!DateTime.TryParse(date, out tarih))
            {
                tarih = DateTime.Today;
            }

            var raporluOgrenciler = await _context.RaporIstekleri
                .Where(r => r.Tarih.Date == tarih.Date && r.Durum == 1)  // Durum byte, bu yüzden 1 yazdık
                .Select(r => new
                {
                    r.OkulNo,
                    r.AdSoyad,
                    r.Sinif,
                    r.Sube,
                })
                .ToListAsync();

            return Ok(raporluOgrenciler);
        }


    }


}

