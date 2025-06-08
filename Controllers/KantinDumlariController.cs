using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using X.Data;
using System.Threading.Tasks;


[Route("api/[controller]")]
[ApiController]
public class KantinDurumlariController : ControllerBase
{
    private readonly AppDbContext _context;

    public KantinDurumlariController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{schoolNo}")]
    public async Task<IActionResult> GetKantinDurumu(int schoolNo)
    {
        var durum = await _context.KantinDurumlari.FirstOrDefaultAsync(k => k.SchoolNo == schoolNo);
        if (durum == null)
            return NotFound();

        return Ok(durum);
    }

}


