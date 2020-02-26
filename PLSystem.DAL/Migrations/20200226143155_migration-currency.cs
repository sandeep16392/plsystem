using Microsoft.EntityFrameworkCore.Migrations;

namespace PLSystem.DAL.Migrations
{
    public partial class migrationcurrency : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "Portfolios",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Currency",
                table: "Portfolios");
        }
    }
}
