using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using X.Data;
using X.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace X.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KantinHarcamaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public KantinHarcamaController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/KantinHarcama/{schoolNo}
        [HttpGet("{schoolNo}")]
        public async Task<ActionResult<IEnumerable<KantinHarcamasi>>> GetHarcamaByStudent(int schoolNo)
        {
            var harcamalar = await _context.KantinHarcamalari
                .Where(k => k.SchoolNo == schoolNo)
                .ToListAsync();

            return harcamalar;
        }

        // POST: api/KantinHarcama
        [HttpPost]
        public async Task<ActionResult<KantinHarcamasi>> PostHarcama(KantinHarcamasi harcama)
        {
            _context.KantinHarcamalari.Add(harcama);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHarcamaByStudent), new { schoolNo = harcama.SchoolNo }, harcama);
        }

        // DELETE: api/KantinHarcama/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHarcama(int id)
        {
            var harcama = await _context.KantinHarcamalari.FindAsync(id);
            if (harcama == null)
            {
                return NotFound();
            }

            _context.KantinHarcamalari.Remove(harcama);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // DELETE: api/KantinHarcama/Temizle
        [HttpDelete("Temizle")]
        public async Task<IActionResult> ClearAllHarcama()
        {
            var allHarcama = await _context.KantinHarcamalari.ToListAsync();

            if (!allHarcama.Any())
                return NotFound("Kantin harcaması bulunamadı.");

            _context.KantinHarcamalari.RemoveRange(allHarcama);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }



}
