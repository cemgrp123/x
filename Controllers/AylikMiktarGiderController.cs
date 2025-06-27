using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class AylikMaliyetController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly SqlConnection _conn;

    public AylikMaliyetController(IConfiguration config)
    {
        _config = config;
        _conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
    }

    [HttpGet]
    public async Task<IActionResult> GetMaliyet([FromQuery] string tablo)
    {
        string sql = $@"
WITH MenuCounts AS (
    SELECT MenuAdi, COUNT(*) AS GunSayisi
    FROM (
        SELECT Yemek1 AS MenuAdi FROM [{tablo}] WHERE Yemek1 IS NOT NULL
        UNION ALL
        SELECT Yemek2 FROM [{tablo}] WHERE Yemek2 IS NOT NULL
        UNION ALL
        SELECT Yemek3 FROM [{tablo}] WHERE Yemek3 IS NOT NULL
    ) AS AllMenus
    GROUP BY MenuAdi
),
MenuUrunleri AS (
    SELECT
        u.UrunAdi,
        u.MiktarGram,
        u.BirimFiyat,
        m.KisiSayisi,
        mc.GunSayisi,
        (u.MiktarGram * mc.GunSayisi * m.KisiSayisi) AS ToplamMiktarGram,
        (u.MiktarGram * mc.GunSayisi * m.KisiSayisi * u.BirimFiyat) AS ToplamMaliyet
    FROM YemekMenusuUrunleri u
    INNER JOIN YemekMenuleri m ON u.MenuId = m.Id
    INNER JOIN MenuCounts mc ON m.MenuAdi = mc.MenuAdi
)
SELECT
    UrunAdi,
    SUM(ToplamMiktarGram) AS AylikToplamMiktarGram,
    MAX(BirimFiyat) AS BirimFiyat,
    SUM(ToplamMaliyet) AS AylikToplamMaliyet
FROM MenuUrunleri
GROUP BY UrunAdi
ORDER BY UrunAdi;";

        var cmd = new SqlCommand(sql, _conn);
        await _conn.OpenAsync();
        var reader = await cmd.ExecuteReaderAsync();

        var list = new List<object>();
        while (await reader.ReadAsync())
        {
            list.Add(new {
                urunAdi = reader["UrunAdi"],
                aylikToplamMiktarGram = reader["AylikToplamMiktarGram"],
                birimFiyat = reader["BirimFiyat"],
                aylikToplamMaliyet = reader["AylikToplamMaliyet"]
            });
        }

        await _conn.CloseAsync();
        return Ok(list);
    }
}
