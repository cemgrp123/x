namespace X.Models
{
    public class OgrenciGuncelleDTO
    {
        public string FullName { get; set; }
        public int StudentClass { get; set; }
        public string Section { get; set; }
        public string ParentName { get; set; }
        public string ParentContact { get; set; }

        public int AylikHak { get; set; }
        public int KullanilanHak { get; set; }
        public int RaporHak { get; set; }
    }
}
