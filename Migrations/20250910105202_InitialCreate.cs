using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace X.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GecislerNew");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Gecisler",
                table: "Gecisler");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Students",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Sube",
                table: "RaporIstekleri",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Sinif",
                table: "RaporIstekleri",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "RaporNedeni",
                table: "RaporIstekleri",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AdSoyad",
                table: "RaporIstekleri",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<byte>(
                name: "Durum",
                table: "RaporIstekleri",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AlterColumn<string>(
                name: "Zaman",
                table: "Gecisler",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Tarih",
                table: "Gecisler",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "OkulNo",
                table: "Gecisler",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Gecisler",
                table: "Gecisler",
                columns: new[] { "OkulNo", "Tarih", "Zaman" });

            migrationBuilder.CreateTable(
                name: "Aralik_Hesapla",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<int>(type: "int", nullable: false),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KantinHarcamasi = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporGunSayisi = table.Column<int>(type: "int", nullable: true),
                    AyingGercekTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    GenelOdeme = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SonOdemeTarihi = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Aralik_Hesapla", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Ekim_Hesapla",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<int>(type: "int", nullable: false),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KantinHarcamasi = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporGunSayisi = table.Column<int>(type: "int", nullable: true),
                    AyingGercekTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    GenelOdeme = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SonOdemeTarihi = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ekim_Hesapla", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Eylul_Hesapla",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<int>(type: "int", nullable: false),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KantinHarcamasi = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporGunSayisi = table.Column<int>(type: "int", nullable: true),
                    AyingGercekTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    GenelOdeme = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SonOdemeTarihi = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Eylul_Hesapla", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Kasim_Hesapla",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<int>(type: "int", nullable: false),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KantinHarcamasi = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporGunSayisi = table.Column<int>(type: "int", nullable: true),
                    AyingGercekTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    GenelOdeme = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SonOdemeTarihi = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kasim_Hesapla", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Mart_Hesapla",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<int>(type: "int", nullable: false),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KantinHarcamasi = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporGunSayisi = table.Column<int>(type: "int", nullable: true),
                    AyingGercekTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    GenelOdeme = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SonOdemeTarihi = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mart_Hesapla", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Mayis_Hesapla",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<int>(type: "int", nullable: false),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KantinHarcamasi = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporGunSayisi = table.Column<int>(type: "int", nullable: true),
                    AyingGercekTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    GenelOdeme = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SonOdemeTarihi = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mayis_Hesapla", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nisan_Hesapla",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<int>(type: "int", nullable: false),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KantinHarcamasi = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporGunSayisi = table.Column<int>(type: "int", nullable: true),
                    AyingGercekTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    GenelOdeme = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SonOdemeTarihi = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nisan_Hesapla", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Ocak_Hesapla",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<int>(type: "int", nullable: false),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KantinHarcamasi = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporGunSayisi = table.Column<int>(type: "int", nullable: true),
                    AyingGercekTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    GenelOdeme = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SonOdemeTarihi = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ocak_Hesapla", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Odemeler_Aralik",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tutar = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OdemeDurumu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SonTarih = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Odemeler_Aralik", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Odemeler_Ekim",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tutar = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OdemeDurumu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SonTarih = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Odemeler_Ekim", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Odemeler_Eylül",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tutar = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OdemeDurumu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SonTarih = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Odemeler_Eylül", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Odemeler_Kasım",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tutar = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OdemeDurumu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SonTarih = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Odemeler_Kasım", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Odemeler_Mart",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tutar = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OdemeDurumu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SonTarih = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Odemeler_Mart", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Odemeler_Mayıs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tutar = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OdemeDurumu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SonTarih = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Odemeler_Mayıs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Odemeler_Nisan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tutar = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OdemeDurumu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SonTarih = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Odemeler_Nisan", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Odemeler_Ocak",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tutar = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OdemeDurumu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SonTarih = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Odemeler_Ocak", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Odemeler_Şubat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tutar = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OdemeDurumu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SonTarih = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Odemeler_Şubat", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Subat_Hesapla",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SchoolNo = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentClass = table.Column<int>(type: "int", nullable: false),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KantinHarcamasi = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporGunSayisi = table.Column<int>(type: "int", nullable: true),
                    AyingGercekTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RaporTutari = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    GenelOdeme = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SonOdemeTarihi = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subat_Hesapla", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "YemekMenuleri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MenuAdi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KisiSayisi = table.Column<int>(type: "int", nullable: false),
                    EklenmeTarihi = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YemekMenuleri", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "YemekMenusu_Agustos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Yemek1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek3 = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YemekMenusu_Agustos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "YemekMenusu_Aralik",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Yemek1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek3 = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YemekMenusu_Aralik", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "YemekMenusu_Ekim",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Yemek1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek3 = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YemekMenusu_Ekim", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "YemekMenusu_Eylul",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Yemek1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek3 = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YemekMenusu_Eylul", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "YemekMenusu_Haziran",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Yemek1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek3 = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YemekMenusu_Haziran", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "YemekMenusu_Kasim",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Yemek1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek3 = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YemekMenusu_Kasim", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "YemekMenusu_Mart",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Yemek1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek3 = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YemekMenusu_Mart", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "YemekMenusu_Mayis",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Yemek1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek3 = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YemekMenusu_Mayis", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "YemekMenusu_Nisan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Yemek1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek3 = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YemekMenusu_Nisan", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "YemekMenusu_Ocak",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Yemek1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek3 = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YemekMenusu_Ocak", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "YemekMenusu_Subat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Yemek1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek3 = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YemekMenusu_Subat", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "YemekMenusu_Temmuz",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Yemek1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Yemek3 = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YemekMenusu_Temmuz", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "YemekMenusuUrunleri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MenuId = table.Column<int>(type: "int", nullable: false),
                    UrunAdi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MiktarGram = table.Column<int>(type: "int", nullable: false),
                    BirimFiyat = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YemekMenusuUrunleri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_YemekMenusuUrunleri_YemekMenuleri_MenuId",
                        column: x => x.MenuId,
                        principalTable: "YemekMenuleri",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_YemekMenusuUrunleri_MenuId",
                table: "YemekMenusuUrunleri",
                column: "MenuId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Aralik_Hesapla");

            migrationBuilder.DropTable(
                name: "Ekim_Hesapla");

            migrationBuilder.DropTable(
                name: "Eylul_Hesapla");

            migrationBuilder.DropTable(
                name: "Kasim_Hesapla");

            migrationBuilder.DropTable(
                name: "Mart_Hesapla");

            migrationBuilder.DropTable(
                name: "Mayis_Hesapla");

            migrationBuilder.DropTable(
                name: "Nisan_Hesapla");

            migrationBuilder.DropTable(
                name: "Ocak_Hesapla");

            migrationBuilder.DropTable(
                name: "Odemeler_Aralik");

            migrationBuilder.DropTable(
                name: "Odemeler_Ekim");

            migrationBuilder.DropTable(
                name: "Odemeler_Eylül");

            migrationBuilder.DropTable(
                name: "Odemeler_Kasım");

            migrationBuilder.DropTable(
                name: "Odemeler_Mart");

            migrationBuilder.DropTable(
                name: "Odemeler_Mayıs");

            migrationBuilder.DropTable(
                name: "Odemeler_Nisan");

            migrationBuilder.DropTable(
                name: "Odemeler_Ocak");

            migrationBuilder.DropTable(
                name: "Odemeler_Şubat");

            migrationBuilder.DropTable(
                name: "Subat_Hesapla");

            migrationBuilder.DropTable(
                name: "YemekMenusu_Agustos");

            migrationBuilder.DropTable(
                name: "YemekMenusu_Aralik");

            migrationBuilder.DropTable(
                name: "YemekMenusu_Ekim");

            migrationBuilder.DropTable(
                name: "YemekMenusu_Eylul");

            migrationBuilder.DropTable(
                name: "YemekMenusu_Haziran");

            migrationBuilder.DropTable(
                name: "YemekMenusu_Kasim");

            migrationBuilder.DropTable(
                name: "YemekMenusu_Mart");

            migrationBuilder.DropTable(
                name: "YemekMenusu_Mayis");

            migrationBuilder.DropTable(
                name: "YemekMenusu_Nisan");

            migrationBuilder.DropTable(
                name: "YemekMenusu_Ocak");

            migrationBuilder.DropTable(
                name: "YemekMenusu_Subat");

            migrationBuilder.DropTable(
                name: "YemekMenusu_Temmuz");

            migrationBuilder.DropTable(
                name: "YemekMenusuUrunleri");

            migrationBuilder.DropTable(
                name: "YemekMenuleri");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Gecisler",
                table: "Gecisler");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "Durum",
                table: "RaporIstekleri");

            migrationBuilder.AlterColumn<string>(
                name: "Sube",
                table: "RaporIstekleri",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Sinif",
                table: "RaporIstekleri",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "RaporNedeni",
                table: "RaporIstekleri",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "AdSoyad",
                table: "RaporIstekleri",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Zaman",
                table: "Gecisler",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Tarih",
                table: "Gecisler",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<int>(
                name: "OkulNo",
                table: "Gecisler",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Gecisler",
                table: "Gecisler",
                column: "OkulNo");

            migrationBuilder.CreateTable(
                name: "GecislerNew",
                columns: table => new
                {
                    OkulNo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdSoyad = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Sinif = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Sube = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Zaman = table.Column<TimeSpan>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GecislerNew", x => x.OkulNo);
                });
        }
    }
}
