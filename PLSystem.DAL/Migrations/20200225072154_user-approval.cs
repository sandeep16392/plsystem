using Microsoft.EntityFrameworkCore.Migrations;

namespace PLSystem.DAL.Migrations
{
    public partial class userapproval : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApprovedBy",
                table: "DailyPLs");

            migrationBuilder.AddColumn<string>(
                name: "UserName1",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "DailyPLs",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserName1",
                table: "Users",
                column: "UserName1");

            migrationBuilder.CreateIndex(
                name: "IX_DailyPLs_UserId",
                table: "DailyPLs",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_DailyPLs_Users_UserId",
                table: "DailyPLs",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserName",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Users_UserName1",
                table: "Users",
                column: "UserName1",
                principalTable: "Users",
                principalColumn: "UserName",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DailyPLs_Users_UserId",
                table: "DailyPLs");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Users_UserName1",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_UserName1",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_DailyPLs_UserId",
                table: "DailyPLs");

            migrationBuilder.DropColumn(
                name: "UserName1",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "DailyPLs");

            migrationBuilder.AddColumn<int>(
                name: "ApprovedBy",
                table: "DailyPLs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
