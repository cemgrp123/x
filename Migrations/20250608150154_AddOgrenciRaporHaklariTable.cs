using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace X.Migrations
{
    /// <inheritdoc />
    public partial class AddOgrenciRaporHaklariTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "OdenecekTutar",
                table: "KantinDurumlari",
                type: "int",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.CreateTable(
                name: "AylikTutarlar",
                columns: table => new
                {
                    AyID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ay = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GunSayisi = table.Column<int>(type: "int", nullable: false),
                    GunlukUcret = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ToplamUcret = table.Column<decimal>(type: "decimal(18,2)", nullable: false, computedColumnSql: "[GunSayisi] * [GunlukUcret]", stored: true),
                    SonOdemeTarihi = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AylikTutarlar", x => x.AyID);
                });

            migrationBuilder.CreateTable(
                name: "Gecisler",
                columns: table => new
                {
                    OkulNo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdSoyad = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Sinif = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Sube = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Zaman = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tarih = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Gecisler", x => x.OkulNo);
                });

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

            migrationBuilder.CreateTable(
                name: "GunlukGelirler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Aciklama = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tutar = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GunlukGelirler", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GunlukGider",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Aciklama = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tutar = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GunlukGider", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OgrenciRaporHaklari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OkulNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RaporHakki = table.Column<int>(type: "int", nullable: false),
                    GuncellemeTarihi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GuncellemeSaati = table.Column<TimeSpan>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OgrenciRaporHaklari", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KantinHarcamalari_SchoolNo",
                table: "KantinHarcamalari",
                column: "SchoolNo");

            migrationBuilder.AddForeignKey(
                name: "FK_KantinHarcamalari_Students_SchoolNo",
                table: "KantinHarcamalari",
                column: "SchoolNo",
                principalTable: "Students",
                principalColumn: "SchoolNo",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KantinHarcamalari_Students_SchoolNo",
                table: "KantinHarcamalari");

            migrationBuilder.DropTable(
                name: "AylikTutarlar");

            migrationBuilder.DropTable(
                name: "Gecisler");

            migrationBuilder.DropTable(
                name: "GecislerNew");

            migrationBuilder.DropTable(
                name: "GunlukGelirler");

            migrationBuilder.DropTable(
                name: "GunlukGider");

            migrationBuilder.DropTable(
                name: "OgrenciRaporHaklari");

            migrationBuilder.DropIndex(
                name: "IX_KantinHarcamalari_SchoolNo",
                table: "KantinHarcamalari");

            migrationBuilder.AlterColumn<decimal>(
                name: "OdenecekTutar",
                table: "KantinDurumlari",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
