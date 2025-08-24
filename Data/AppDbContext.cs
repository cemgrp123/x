using Microsoft.EntityFrameworkCore;
using X.Migrations;
using X.Models;

namespace X.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Student> Students { get; set; }
        public DbSet<KantinDurumlari> KantinDurumlari { get; set; }
        public DbSet<KantinHarcamasi> KantinHarcamalari { get; set; }
        public DbSet<Gecis> Gecisler { get; set; }
        public DbSet<YemekMenusu> YemekMenuleri { get; set; }
        public DbSet<YemekMenusuUrun> YemekMenusuUrunler { get; set; }
        public DbSet<RaporIstekleri> RaporIstekleri { get; set; }
        public DbSet<GunlukGelir> GunlukGelirler { get; set; }
        public DbSet<GunlukGider> GunlukGiderler { get; set; }
        public DbSet<AylikTutarlar> AylikTutarlar { get; set; }


        public DbSet<Vw_OgrenciOdemeleriAtlamali> Vw_OgrenciOdemeleriAtlamali { get; set; }


        public DbSet<YemekMenusu_Ocak> YemekMenusu_Ocak { get; set; }
        public DbSet<YemekMenusu_Subat> YemekMenusu_Subat { get; set; }
        public DbSet<YemekMenusu_Mart> YemekMenusu_Mart { get; set; }
        public DbSet<YemekMenusu_Nisan> YemekMenusu_Nisan { get; set; }
        public DbSet<YemekMenusu_Mayis> YemekMenusu_Mayis { get; set; }
        public DbSet<YemekMenusu_Haziran> YemekMenusu_Haziran { get; set; }
        public DbSet<YemekMenusu_Temmuz> YemekMenusu_Temmuz { get; set; }
        public DbSet<YemekMenusu_Agustos> YemekMenusu_Agustos { get; set; }
        public DbSet<YemekMenusu_Eylul> YemekMenusu_Eylul { get; set; }
        public DbSet<YemekMenusu_Ekim> YemekMenusu_Ekim { get; set; }
        public DbSet<YemekMenusu_Kasim> YemekMenusu_Kasim { get; set; }
        public DbSet<YemekMenusu_Aralik> YemekMenusu_Aralik { get; set; }

        public DbSet<OdemeEylul> Odemeler_Eylul { get; set; }
        public DbSet<OdemeEkim> Odemeler_Ekim { get; set; }
        public DbSet<OdemeKasim> Odemeler_Kasim { get; set; }
        public DbSet<OdemeAralik> Odemeler_Aralik { get; set; }
        public DbSet<OdemeOcak> Odemeler_Ocak { get; set; }
        public DbSet<OdemeSubat> Odemeler_Subat { get; set; }
        public DbSet<OdemeMart> Odemeler_Mart { get; set; }
        public DbSet<OdemeNisan> Odemeler_Nisan { get; set; }
        public DbSet<OdemeMayis> Odemeler_Mayis { get; set; }






        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Composite primary key tanımla
            modelBuilder.Entity<Gecis>()
                .HasKey(g => new { g.OkulNo, g.Tarih, g.Zaman });

            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<YemekMenusu>().ToTable("YemekMenuleri");
            modelBuilder.Entity<YemekMenusuUrun>().ToTable("YemekMenusuUrunleri"); // Tablo adını burada eşle
                                                                                   // Gecis tablosu adı
            modelBuilder.Entity<OdemeEylul>().ToTable("Odemeler_Eylül");
            modelBuilder.Entity<OdemeEkim>().ToTable("Odemeler_Ekim");
            modelBuilder.Entity<OdemeKasim>().ToTable("Odemeler_Kasım");
            modelBuilder.Entity<OdemeAralik>().ToTable("Odemeler_Aralık");
            modelBuilder.Entity<OdemeOcak>().ToTable("Odemeler_Ocak");
            modelBuilder.Entity<OdemeSubat>().ToTable("Odemeler_Şubat");
            modelBuilder.Entity<OdemeMart>().ToTable("Odemeler_Mart");
            modelBuilder.Entity<OdemeNisan>().ToTable("Odemeler_Nisan");
            modelBuilder.Entity<OdemeMayis>().ToTable("Odemeler_Mayıs");

            // GunlukGider tablosu adı
            modelBuilder.Entity<GunlukGider>().ToTable("GunlukGider");

            // AylikTutarlar yapılandırması
            modelBuilder.Entity<AylikTutarlar>(entity =>
            {
                entity.ToTable("AylikTutarlar");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("AyID");

                entity.Property(e => e.Ay).HasColumnName("Ay");

                entity.Property(e => e.GunSayisi).HasColumnName("GunSayisi");

                entity.Property(e => e.GunlukUcret).HasColumnName("GunlukUcret");

                entity.Property(e => e.ToplamUcret)
                    .HasColumnName("ToplamUcret")
                    .HasComputedColumnSql("[GunSayisi] * [GunlukUcret]", stored: true);

                entity.Property(e => e.SonOdemeTarihi).HasColumnName("SonOdemeTarihi");
            });

            modelBuilder.Entity<Vw_OgrenciOdemeleriAtlamali>(entity =>
 {
     entity.HasNoKey();
     entity.ToView("Vw_OgrenciOdemeleriAtlamali");

     entity.Property(e => e.SchoolNo);
     entity.Property(e => e.FullName);
     entity.Property(e => e.StudentClass);
     entity.Property(e => e.Section);
     entity.Property(e => e.Yil);
     entity.Property(e => e.Ay);
     entity.Property(e => e.OncekiAyKantinHarcamasi);
     entity.Property(e => e.OncekiAyRaporHakkiTutari);

     entity.Property(e => e.AylikUcret);
     entity.Property(e => e.HesaplananGenelOdeme);
 });


            // KantinHarcamasi ilişkisi
            modelBuilder.Entity<KantinHarcamasi>()
                .HasOne(k => k.Student)
                .WithMany(s => s.KantinHarcamalari)
                .HasForeignKey(k => k.SchoolNo)
                .OnDelete(DeleteBehavior.Cascade);

            // KantinDurumlari ilişkisi
            modelBuilder.Entity<KantinDurumlari>()
                .HasOne(kd => kd.Student)
                .WithOne(s => s.KantinDurumlari)
                .HasForeignKey<KantinDurumlari>(kd => kd.SchoolNo)
                .OnDelete(DeleteBehavior.Cascade);

            // diğer konfigürasyonlar buraya eklenebilir
        }
    }
}
