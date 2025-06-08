using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Linq;
using X.Data;
using Microsoft.EntityFrameworkCore;

// Model sınıfı
public class GecisRequest
{
    public int OkulNo { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class GecisController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public GecisController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost]
    public async Task<IActionResult> GecisYap([FromBody] GecisRequest request)
    {
        if (request.OkulNo <= 0)
            return BadRequest(new { message = "Geçersiz okul numarası." });

        var ogrenci = await _dbContext.Students
            .Where(o => o.SchoolNo == request.OkulNo)
            .Select(o => new
            {
                o.SchoolNo,
                FullName = o.FullName,
                StudentClass = o.StudentClass,
                Section = o.Section
            })
            .FirstOrDefaultAsync();

        if (ogrenci == null)
            return NotFound(new { message = "Öğrenci bulunamadı." });

        return Ok(new
        {
            okulNo = ogrenci.SchoolNo,
            adSoyad = ogrenci.FullName,
            sinif = ogrenci.StudentClass,
            sube = ogrenci.Section
        });
    }
    
}

