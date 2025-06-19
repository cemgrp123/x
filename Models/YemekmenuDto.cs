using System.Collections.Generic;

public class YeniUrunDto
{
    public string UrunAdi { get; set; }
    public int MiktarGram { get; set; }   // int olarak değiştirdim
    public decimal BirimFiyat { get; set; }
}

public class YeniMenuDto
{
    public string MenuAdi { get; set; }
    public int KisiSayisi { get; set; }
    public List<YeniUrunDto> Urunler { get; set; }
}

