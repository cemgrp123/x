using System;
using System.ComponentModel.DataAnnotations;

public class GecisNew
{
    [Key]
    public int OkulNo { get; set; }

    public string AdSoyad { get; set; }
    public string Sinif { get; set; }
    public string Sube { get; set; }

    public DateTime Tarih { get; set; }
    public TimeSpan Zaman { get; set; }
}
