using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

public class AylikTutarlar
{
    [Key]
    [Column("AyID")]
    public int Id { get; set; }  // burada veritabanındaki kolon ismi AyID ile eşleşiyor

    public string Ay { get; set; }
    public int GunSayisi { get; set; }
    public decimal GunlukUcret { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public decimal ToplamUcret { get; set; }

    public DateTime SonOdemeTarihi { get; set; }
}
