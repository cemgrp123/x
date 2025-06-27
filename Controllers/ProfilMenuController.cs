using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using X.Data;

namespace X.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class YemekMenusuController : ControllerBase
    {
        private readonly AppDbContext _context;

        public YemekMenusuController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("gun")]
public IActionResult GetMenuByDate([FromQuery] string date)
{
    if (!DateTime.TryParse(date, out var parsedDate))
        return BadRequest("Geçersiz tarih formatı.");

    var ay = parsedDate.Month;  
    var gun = parsedDate.Day;

    // Menü kaydını tutacak değişkenler
    object menuRecord = null;

    switch (ay)
    {
        case 1:
            menuRecord = _context.YemekMenusu_Ocak.FirstOrDefault(x => x.Tarih.Date == parsedDate.Date);
            break;
        case 2:
            menuRecord = _context.YemekMenusu_Subat.FirstOrDefault(x => x.Tarih.Date == parsedDate.Date);
            break;
        case 3:
            menuRecord = _context.YemekMenusu_Mart.FirstOrDefault(x => x.Tarih.Date == parsedDate.Date);
            break;
        case 4:
            menuRecord = _context.YemekMenusu_Nisan.FirstOrDefault(x => x.Tarih.Date == parsedDate.Date);
            break;
        case 5:
            menuRecord = _context.YemekMenusu_Mayis.FirstOrDefault(x => x.Tarih.Date == parsedDate.Date);
            break;
        case 6:
            menuRecord = _context.YemekMenusu_Haziran.FirstOrDefault(x => x.Tarih.Date == parsedDate.Date);
            break;
        case 7:
            menuRecord = _context.YemekMenusu_Temmuz.FirstOrDefault(x => x.Tarih.Date == parsedDate.Date);
            break;
        case 8:
            menuRecord = _context.YemekMenusu_Agustos.FirstOrDefault(x => x.Tarih.Date == parsedDate.Date);
            break;
        case 9:
            menuRecord = _context.YemekMenusu_Eylul.FirstOrDefault(x => x.Tarih.Date == parsedDate.Date);
            break;
        case 10:
            menuRecord = _context.YemekMenusu_Ekim.FirstOrDefault(x => x.Tarih.Date == parsedDate.Date);
            break;
        case 11:
            menuRecord = _context.YemekMenusu_Kasim.FirstOrDefault(x => x.Tarih.Date == parsedDate.Date);
            break;
        case 12:
            menuRecord = _context.YemekMenusu_Aralik.FirstOrDefault(x => x.Tarih.Date == parsedDate.Date);
            break;
        default:
            return NotFound("Geçersiz ay.");
    }

    if (menuRecord == null)
        return NotFound("Bu gün için menü bulunamadı.");

    // Reflection ile yemekleri çek (Yemek1, Yemek2, Yemek3)
    var items = new List<object>();
    var props = menuRecord.GetType().GetProperties();

    foreach (var prop in props)
    {
        if (prop.Name.StartsWith("Yemek"))
        {
            var val = prop.GetValue(menuRecord) as string;
            if (!string.IsNullOrEmpty(val))
            {
                items.Add(new { name = val, type = "anayemek" }); // istersen type'ı farklı yapabilirsin
            }
        }
    }

    var result = new
    {
        date = parsedDate.ToString("yyyy-MM-dd"),
        items = items
    };

    return Ok(result);
}

    }
}
