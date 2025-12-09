using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DovizTakipApi.Migrations
{
    /// <inheritdoc />
    public partial class WalletTablosuEkle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Wallets_UserId",
                table: "Wallets");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdated",
                table: "Wallets",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_Wallets_UserId_CurrencyCode",
                table: "Wallets",
                columns: new[] { "UserId", "CurrencyCode" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Wallets_UserId_CurrencyCode",
                table: "Wallets");

            migrationBuilder.DropColumn(
                name: "LastUpdated",
                table: "Wallets");

            migrationBuilder.CreateIndex(
                name: "IX_Wallets_UserId",
                table: "Wallets",
                column: "UserId");
        }
    }
}
