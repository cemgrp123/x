using System;
using System.ComponentModel.DataAnnotations;
public class RaporIstekleri
{
    public int Id { get; set; }

    [Required]
    public int OkulNo { get; set; }

    [Required]
    public string AdSoyad { get; set; }

    [Required]
    public int Sinif { get; set; }  // burayı int yap

    [Required]
    public string Sube { get; set; }

    [Required]
    public DateTime Tarih { get; set; }

    [Required]
    public string RaporNedeni { get; set; }

    public DateTime Zaman { get; set; }
    public byte Durum { get; set; }  // 0,1,2 değerleri alacak, byte tipine uyacak şekilde


}
