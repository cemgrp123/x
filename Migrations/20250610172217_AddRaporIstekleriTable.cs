using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace X.Migrations
{
    /// <inheritdoc />
    public partial class AddRaporIstekleriTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OgrenciRaporHaklari");

            migrationBuilder.CreateTable(
                name: "RaporIstekleri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OkulNo = table.Column<int>(type: "int", nullable: false),
                    AdSoyad = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Sinif = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Sube = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RaporNedeni = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Zaman = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RaporIstekleri", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RaporIstekleri");

            migrationBuilder.CreateTable(
                name: "OgrenciRaporHaklari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GuncellemeSaati = table.Column<TimeSpan>(type: "time", nullable: false),
                    GuncellemeTarihi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    OkulNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RaporHakki = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OgrenciRaporHaklari", x => x.Id);
                });
        }
    }
}
