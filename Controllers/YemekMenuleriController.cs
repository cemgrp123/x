using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using X.Data;   // DbContext’in olduğu namespace
using X.Models;   // Model sınıflarının olduğu namespace

[ApiController]
[Route("api/[controller]")]
public class YemekMenusuController : ControllerBase
{
    private readonly AppDbContext _context;
    public YemekMenusuController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{ay}")]
    public async Task<IActionResult> GetByMonth(string ay)
    {
        switch (ay.ToLower())
        {
            case "ocak": return Ok(await _context.YemekMenusu_Ocak.ToListAsync());
            case "subat": return Ok(await _context.YemekMenusu_Subat.ToListAsync());
            case "mart": return Ok(await _context.YemekMenusu_Mart.ToListAsync());
            case "nisan": return Ok(await _context.YemekMenusu_Nisan.ToListAsync());
            case "mayis": return Ok(await _context.YemekMenusu_Mayis.ToListAsync());
            case "haziran": return Ok(await _context.YemekMenusu_Haziran.ToListAsync());
            case "temmuz": return Ok(await _context.YemekMenusu_Temmuz.ToListAsync());
            case "agustos": return Ok(await _context.YemekMenusu_Agustos.ToListAsync());
            case "eylul": return Ok(await _context.YemekMenusu_Eylul.ToListAsync());
            case "ekim": return Ok(await _context.YemekMenusu_Ekim.ToListAsync());
            case "kasim": return Ok(await _context.YemekMenusu_Kasim.ToListAsync());
            case "aralik": return Ok(await _context.YemekMenusu_Aralik.ToListAsync());
            default: return BadRequest("Geçersiz ay");
        }
    }

    [HttpPost("{ay}")]
    public async Task<IActionResult> PostByMonth(string ay, [FromBody] YemekMenusuPostModel model)
    {
        if (model == null)
            return BadRequest("Model boş olamaz");

        try
        {
            switch (ay.ToLower())
            {
                case "ocak":
                    _context.YemekMenusu_Ocak.Add(new YemekMenusu_Ocak
                    {
                        Tarih = model.Tarih,
                        Yemek1 = model.Yemek1,
                        Yemek2 = model.Yemek2,
                        Yemek3 = model.Yemek3
                    });
                    break;
                case "subat":
                    _context.YemekMenusu_Subat.Add(new YemekMenusu_Subat
                    {
                        Tarih = model.Tarih,
                        Yemek1 = model.Yemek1,
                        Yemek2 = model.Yemek2,
                        Yemek3 = model.Yemek3
                    });
                    break;
                case "mart":
                    _context.YemekMenusu_Mart.Add(new YemekMenusu_Mart
                    {
                        Tarih = model.Tarih,
                        Yemek1 = model.Yemek1,
                        Yemek2 = model.Yemek2,
                        Yemek3 = model.Yemek3
                    });
                    break;
                case "nisan":
                    _context.YemekMenusu_Nisan.Add(new YemekMenusu_Nisan
                    {
                        Tarih = model.Tarih,
                        Yemek1 = model.Yemek1,
                        Yemek2 = model.Yemek2,
                        Yemek3 = model.Yemek3
                    });
                    break;
                case "mayis":
                    _context.YemekMenusu_Mayis.Add(new YemekMenusu_Mayis
                    {
                        Tarih = model.Tarih,
                        Yemek1 = model.Yemek1,
                        Yemek2 = model.Yemek2,
                        Yemek3 = model.Yemek3
                    });
                    break;
                case "haziran":
                    _context.YemekMenusu_Haziran.Add(new YemekMenusu_Haziran
                    {
                        Tarih = model.Tarih,
                        Yemek1 = model.Yemek1,
                        Yemek2 = model.Yemek2,
                        Yemek3 = model.Yemek3
                    });
                    break;
                case "temmuz":
                    _context.YemekMenusu_Temmuz.Add(new YemekMenusu_Temmuz
                    {
                        Tarih = model.Tarih,
                        Yemek1 = model.Yemek1,
                        Yemek2 = model.Yemek2,
                        Yemek3 = model.Yemek3
                    });
                    break;
                case "agustos":
                    _context.YemekMenusu_Agustos.Add(new YemekMenusu_Agustos
                    {
                        Tarih = model.Tarih,
                        Yemek1 = model.Yemek1,
                        Yemek2 = model.Yemek2,
                        Yemek3 = model.Yemek3
                    });
                    break;
                case "eylul":
                    _context.YemekMenusu_Eylul.Add(new YemekMenusu_Eylul
                    {
                        Tarih = model.Tarih,
                        Yemek1 = model.Yemek1,
                        Yemek2 = model.Yemek2,
                        Yemek3 = model.Yemek3
                    });
                    break;
                case "ekim":
                    _context.YemekMenusu_Ekim.Add(new YemekMenusu_Ekim
                    {
                        Tarih = model.Tarih,
                        Yemek1 = model.Yemek1,
                        Yemek2 = model.Yemek2,
                        Yemek3 = model.Yemek3
                    });
                    break;
                case "kasim":
                    _context.YemekMenusu_Kasim.Add(new YemekMenusu_Kasim
                    {
                        Tarih = model.Tarih,
                        Yemek1 = model.Yemek1,
                        Yemek2 = model.Yemek2,
                        Yemek3 = model.Yemek3
                    });
                    break;
                case "aralik":
                    _context.YemekMenusu_Aralik.Add(new YemekMenusu_Aralik
                    {
                        Tarih = model.Tarih,
                        Yemek1 = model.Yemek1,
                        Yemek2 = model.Yemek2,
                        Yemek3 = model.Yemek3
                    });
                    break;
                default:
                    return BadRequest("Geçersiz ay");
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }


    }
    [HttpDelete("{ay}")]
    public async Task<IActionResult> DeleteAllByMonth(string ay)
    {
        try
        {
            switch (ay.ToLower())
            {
                case "ocak":
                    _context.YemekMenusu_Ocak.RemoveRange(_context.YemekMenusu_Ocak);
                    break;
                case "subat":
                    _context.YemekMenusu_Subat.RemoveRange(_context.YemekMenusu_Subat);
                    break;
                case "mart":
                    _context.YemekMenusu_Mart.RemoveRange(_context.YemekMenusu_Mart);
                    break;
                case "nisan":
                    _context.YemekMenusu_Nisan.RemoveRange(_context.YemekMenusu_Nisan);
                    break;
                case "mayis":
                    _context.YemekMenusu_Mayis.RemoveRange(_context.YemekMenusu_Mayis);
                    break;
                case "haziran":
                    _context.YemekMenusu_Haziran.RemoveRange(_context.YemekMenusu_Haziran);
                    break;
                case "temmuz":
                    _context.YemekMenusu_Temmuz.RemoveRange(_context.YemekMenusu_Temmuz);
                    break;
                case "agustos":
                    _context.YemekMenusu_Agustos.RemoveRange(_context.YemekMenusu_Agustos);
                    break;
                case "eylul":
                    _context.YemekMenusu_Eylul.RemoveRange(_context.YemekMenusu_Eylul);
                    break;
                case "ekim":
                    _context.YemekMenusu_Ekim.RemoveRange(_context.YemekMenusu_Ekim);
                    break;
                case "kasim":
                    _context.YemekMenusu_Kasim.RemoveRange(_context.YemekMenusu_Kasim);
                    break;
                case "aralik":
                    _context.YemekMenusu_Aralik.RemoveRange(_context.YemekMenusu_Aralik);
                    break;
                default:
                    return BadRequest("Geçersiz ay");
            }

            await _context.SaveChangesAsync();
            return Ok("Tüm yemek menüsü kayıtları silindi.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
    

}

public class YemekMenusuPostModel
{
    public DateTime Tarih { get; set; }
    public string Yemek1 { get; set; }
    public string Yemek2 { get; set; }
    public string Yemek3 { get; set; }
}
