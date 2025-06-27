public class Vw_OgrenciOdemeleriAtlamali
{
   public int SchoolNo { get; set; }
    public string FullName { get; set; }
    public int StudentClass { get; set; }
    public string Section { get; set; }
    public int Yil { get; set; }
    public int Ay { get; set; }
    public decimal? OncekiAyKantinHarcamasi{ get; set; }  // nullable decimal
    
    public int? OncekiAyRaporHakkiTutari { get; set; }  // <-- burası doğru isim
    public decimal? AylikUcret { get; set; }      // nullable decimal
    public decimal? HesaplananGenelOdeme{ get; set; }       // nullable decimal
}
