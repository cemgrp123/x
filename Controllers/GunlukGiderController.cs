using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using X.Models; // Projenin namespace'ini yaz
using X.Data;   // DbContext'in bulunduğu namespace
using System.Linq;

[Route("api/[controller]")]
[ApiController]
public class GunlukGiderController : ControllerBase
{
    private readonly AppDbContext _context;

    public GunlukGiderController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GunlukGider>>> Get()
    {
        return await _context.GunlukGiderler.OrderByDescending(g => g.Tarih).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult> Post(GunlukGider gider)
    {
        _context.GunlukGiderler.Add(gider);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var gider = await _context.GunlukGiderler.FindAsync(id);
        if (gider == null)
        {
            return NotFound();
        }

        _context.GunlukGiderler.Remove(gider);
        await _context.SaveChangesAsync();

        return Ok();
    }
}
