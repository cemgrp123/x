using System;
using System.Collections.Generic;

public class YemekMenusu
{
    public int Id { get; set; }
    public string MenuAdi { get; set; }
    public int KisiSayisi { get; set; }
    public DateTime EklenmeTarihi { get; set; } = DateTime.Now;

    public List<YemekMenusuUrun> Urunler { get; set; }
}

public class YemekMenusuUrun
{
    public int Id { get; set; }
    public int MenuId { get; set; }
    public string UrunAdi { get; set; }
    public int MiktarGram { get; set; }
    public decimal BirimFiyat { get; set; }

    public YemekMenusu Menu { get; set; }
}
