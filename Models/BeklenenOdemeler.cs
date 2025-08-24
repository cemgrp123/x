using System;
using System.ComponentModel.DataAnnotations.Schema;

public class Odeme
{
      public int Id { get; set; } // Eğer veritabanında int ise
    public string SchoolNo { get; set; }  // Eğer varchar veya nvarchar ise string yap
    public string FullName { get; set; }
    public string StudentClass { get; set; }
    public string Section { get; set; }
    public decimal Tutar { get; set; }
    public string OdemeDurumu { get; set; }
    public DateTime SonTarih { get; set; }
}

public class OdemeEylul : Odeme { }
public class OdemeEkim : Odeme { }
public class OdemeKasim : Odeme { }
public class OdemeAralik : Odeme { }
public class OdemeOcak : Odeme { }
public class OdemeSubat : Odeme { }
public class OdemeMart : Odeme { }
public class OdemeNisan : Odeme { }
public class OdemeMayis : Odeme { }
