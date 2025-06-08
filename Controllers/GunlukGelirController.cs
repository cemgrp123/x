using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using X.Models; // Projenin namespace'ini yaz
using X.Data;   // DbContext'in bulunduğu namespace
using System.Linq;


[ApiController]
[Route("api/[controller]")]
public class GunlukGelirController : ControllerBase
{
    private readonly AppDbContext _context;

    public GunlukGelirController(AppDbContext context)
    {
        _context = context;
    }

    // Tüm gelirleri listele
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GunlukGelir>>> GetAll()
    {
        return await _context.GunlukGelirler
            .OrderByDescending(g => g.Tarih)
            .ToListAsync();
    }

    // Yeni gelir ekle
    [HttpPost]
    public async Task<ActionResult<GunlukGelir>> Add(GunlukGelir gelir)
    {
        _context.GunlukGelirler.Add(gelir);
        await _context.SaveChangesAsync();
        return Ok(gelir);
    }

    // Gelir sil
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var gelir = await _context.GunlukGelirler.FindAsync(id);
        if (gelir == null)
            return NotFound();

        _context.GunlukGelirler.Remove(gelir);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
