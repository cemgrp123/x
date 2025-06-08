using System;

namespace X.Models
{
 public class KantinHarcamasi
{
    public int Id { get; set; }

    public int SchoolNo { get; set; }

    public Student Student { get; set; }

    public DateTime Tarih { get; set; }

    public string Urun { get; set; }

    public decimal Tutar { get; set; }
}

}
