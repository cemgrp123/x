using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace X.Models
{
  public class KantinDurumlari
{
    [Key]
    [ForeignKey("Student")]
    public int SchoolNo { get; set; }

    public int AylikHak { get; set; }  // burası HakSayisi değil
    public int KullanilanHak { get; set; }
    public int RaporHak { get; set; }
    public int OdenecekTutar { get; set; }

    public Student Student { get; set; }
}
}
