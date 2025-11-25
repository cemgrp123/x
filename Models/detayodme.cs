#nullable enable
using System;

namespace X.Models
{
    public class OdemeTablo
    {
        public int Id { get; set; }
        public int SchoolNo { get; set; }
        public string? FullName { get; set; }
        public int StudentClass { get; set; }
        public string? Section { get; set; }
        public decimal? KantinHarcamasi { get; set; }
        public int? RaporGunSayisi { get; set; }
        public decimal? AyingGercekTutari { get; set; }
        public decimal? RaporTutari { get; set; }
        public decimal? GenelOdeme { get; set; }
        public DateTime? SonOdemeTarihi { get; set; }
    }

    public class OdemeEylul1 : OdemeTablo { }
    public class OdemeEkim1 : OdemeTablo { }
    public class OdemeKasim1 : OdemeTablo { }
    public class OdemeAralik1 : OdemeTablo { }
    public class OdemeOcak1 : OdemeTablo { }
    public class OdemeSubat1 : OdemeTablo { }
    public class OdemeMart1 : OdemeTablo { }
    public class OdemeNisan1 : OdemeTablo { }
    public class OdemeMayis1 : OdemeTablo { }
}
