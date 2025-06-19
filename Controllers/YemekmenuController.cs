using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using X.Data;

[ApiController]
[Route("api/[controller]")]
public class YemekMenuleriController : ControllerBase
{
    private readonly AppDbContext _context;

    public YemekMenuleriController(AppDbContext context)
    {
        _context = context;
    }

    // Menüleri listele
    [HttpGet]
    public async Task<ActionResult<List<YemekMenusu>>> GetMenus()
    {
        var menus = await _context.YemekMenuleri.Include(m => m.Urunler).ToListAsync();
        return Ok(menus);
    }

    // Yeni Menü Ekle
    [HttpPost("ekle")]
    public async Task<ActionResult<YemekMenusu>> AddMenu([FromBody] YeniMenuDto dto)
    {
        var menu = new YemekMenusu
        {
            MenuAdi = dto.MenuAdi,
            KisiSayisi = dto.KisiSayisi,
            Urunler = dto.Urunler?.Select(u => new YemekMenusuUrun
            {
                UrunAdi = u.UrunAdi,
                MiktarGram = u.MiktarGram,
                BirimFiyat = u.BirimFiyat
            }).ToList() ?? new List<YemekMenusuUrun>()
        };

        _context.YemekMenuleri.Add(menu);
        await _context.SaveChangesAsync();

        var createdMenu = await _context.YemekMenuleri
                                .Include(m => m.Urunler)
                                .FirstOrDefaultAsync(m => m.Id == menu.Id);

        return Ok(createdMenu);
    }

    // Menü Güncelle
    [HttpPut("{menuId}")]
    public async Task<IActionResult> UpdateMenu(int menuId, [FromBody] YeniMenuDto dto)
    {
        var menu = await _context.YemekMenuleri.FindAsync(menuId);
        if (menu == null) return NotFound();

        menu.MenuAdi = dto.MenuAdi;
        menu.KisiSayisi = dto.KisiSayisi;
        await _context.SaveChangesAsync();

        return Ok();
    }

    // Menüye Ürün Ekle
    [HttpPost("{menuId}/urunler/ekle")]
    public async Task<IActionResult> AddProduct(int menuId, [FromBody] YeniUrunDto dto)
    {
        var menu = await _context.YemekMenuleri.Include(m => m.Urunler).FirstOrDefaultAsync(m => m.Id == menuId);
        if (menu == null) return NotFound();

        var newProduct = new YemekMenusuUrun
        {
            UrunAdi = dto.UrunAdi,
            MiktarGram = dto.MiktarGram,
            BirimFiyat = dto.BirimFiyat,
             MenuId = menuId  
        };

        _context.YemekMenusuUrunler.Add(newProduct);
        await _context.SaveChangesAsync();

        return Ok(newProduct);
    }

    // Menüdeki Ürünü Güncelle
    [HttpPut("{menuId}/urunler/{urunId}")]
    public async Task<IActionResult> UpdateProduct(int menuId, int urunId, [FromBody] YeniUrunDto dto)
    {
        var urun = await _context.YemekMenusuUrunler
            .FirstOrDefaultAsync(u => u.Id == urunId && u.MenuId == menuId);

        if (urun == null) return NotFound();

        urun.UrunAdi = dto.UrunAdi;
        urun.MiktarGram = dto.MiktarGram;
        urun.BirimFiyat = dto.BirimFiyat;

        await _context.SaveChangesAsync();

        return Ok();
    }
}
