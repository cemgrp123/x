using System.ComponentModel.DataAnnotations;
using System;


public class Gecis
{
    [Key]
    public int OkulNo { get; set; }

    public string AdSoyad { get; set; }
    public string Sinif { get; set; }
    public string Sube { get; set; }
    public string Zaman { get; set; }
    public string Tarih { get; set; }
}

