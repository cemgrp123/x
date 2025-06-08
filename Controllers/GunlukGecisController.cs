using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Collections.Generic;
using System;
using X.Data;       // DbContext'in namespace'i
using X.Models;     // Model namespace'i

namespace X.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GecisController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public GecisController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("GetGirisler")]
        public IActionResult GetGirisler([FromQuery] int schoolNo)
        {
            var girisler = _dbContext.GecislerNew
                .Where(g => g.OkulNo == schoolNo)
                .OrderByDescending(g => g.Tarih)
                .ThenByDescending(g => g.Zaman)
                .Select(g => new
                {
                    Tarih = g.Tarih,              // DateTime türü
                    Zaman = g.Zaman.ToString()    // TimeSpan string olarak döner
                })
                .ToList();

            return Ok(girisler);
        }


    }
}
