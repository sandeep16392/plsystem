using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace PLSystem.DAL.Migrations
{
    public partial class userlatestmig : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Hierarchies",
                columns: table => new
                {
                    DEPT_LEAF_NODE = table.Column<string>(nullable: false),
                    DEPT_L3_NODE_M = table.Column<string>(nullable: true),
                    DEPT_L4_NODE_M = table.Column<string>(nullable: true),
                    DEPT_L5_NODE_M = table.Column<string>(nullable: true),
                    DEPT_L6_NODE_M = table.Column<string>(nullable: true),
                    DEPT_L7_NODE_M = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hierarchies", x => x.DEPT_LEAF_NODE);
                });

            migrationBuilder.CreateTable(
                name: "UserGroups",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGroups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserName = table.Column<string>(nullable: false),
                    Id = table.Column<int>(nullable: false),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    PasswordHash = table.Column<byte[]>(nullable: true),
                    PasswordSalt = table.Column<byte[]>(nullable: true),
                    Created = table.Column<DateTime>(nullable: false),
                    LastActive = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserName);
                });

            migrationBuilder.CreateTable(
                name: "Estimates",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(nullable: false),
                    ExplainedVariance = table.Column<double>(nullable: false),
                    EstimateAmount = table.Column<double>(nullable: false),
                    HierarchyId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estimates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Estimates_Hierarchies_HierarchyId",
                        column: x => x.HierarchyId,
                        principalTable: "Hierarchies",
                        principalColumn: "DEPT_LEAF_NODE",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Portfolios",
                columns: table => new
                {
                    PortfolioId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Portfolio_Name = table.Column<string>(nullable: true),
                    Source_System = table.Column<string>(nullable: true),
                    Region = table.Column<string>(nullable: true),
                    Start_Date = table.Column<DateTime>(nullable: false),
                    End_Date = table.Column<DateTime>(nullable: false),
                    IsActive = table.Column<bool>(nullable: false),
                    HierarchyId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Portfolios", x => x.PortfolioId);
                    table.ForeignKey(
                        name: "FK_Portfolios_Hierarchies_HierarchyId",
                        column: x => x.HierarchyId,
                        principalTable: "Hierarchies",
                        principalColumn: "DEPT_LEAF_NODE",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserGroupHierarchies",
                columns: table => new
                {
                    UserGroupId = table.Column<string>(nullable: false),
                    HierarchyId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGroupHierarchies", x => new { x.HierarchyId, x.UserGroupId });
                    table.ForeignKey(
                        name: "FK_UserGroupHierarchies_Hierarchies_HierarchyId",
                        column: x => x.HierarchyId,
                        principalTable: "Hierarchies",
                        principalColumn: "DEPT_LEAF_NODE",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserGroupHierarchies_UserGroups_UserGroupId",
                        column: x => x.UserGroupId,
                        principalTable: "UserGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserUserGroups",
                columns: table => new
                {
                    UserName = table.Column<string>(nullable: false),
                    UserGroupId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserUserGroups", x => new { x.UserName, x.UserGroupId });
                    table.ForeignKey(
                        name: "FK_UserUserGroups_UserGroups_UserGroupId",
                        column: x => x.UserGroupId,
                        principalTable: "UserGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserUserGroups_Users_UserName",
                        column: x => x.UserName,
                        principalTable: "Users",
                        principalColumn: "UserName",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DailyPLs",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Business_Date = table.Column<DateTime>(nullable: false),
                    Daily_PL = table.Column<double>(nullable: false),
                    IsApproved = table.Column<bool>(nullable: false),
                    IsReviewed = table.Column<bool>(nullable: false),
                    ApprovedBy = table.Column<int>(nullable: false),
                    ApprovedDate = table.Column<DateTime>(nullable: false),
                    LastUpdated = table.Column<DateTime>(nullable: false),
                    Sent_To_FO_Flag = table.Column<bool>(nullable: false),
                    Commentary1 = table.Column<string>(nullable: true),
                    Commentary2 = table.Column<string>(nullable: true),
                    PortfolioId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyPLs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DailyPLs_Portfolios_PortfolioId",
                        column: x => x.PortfolioId,
                        principalTable: "Portfolios",
                        principalColumn: "PortfolioId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DailyTrades",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Business_Date = table.Column<DateTime>(nullable: false),
                    NewTrades = table.Column<double>(nullable: false),
                    Ammends = table.Column<double>(nullable: false),
                    Adjustment = table.Column<double>(nullable: false),
                    Unexplained = table.Column<double>(nullable: false),
                    PortfolioId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyTrades", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DailyTrades_Portfolios_PortfolioId",
                        column: x => x.PortfolioId,
                        principalTable: "Portfolios",
                        principalColumn: "PortfolioId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DailyPLs_PortfolioId",
                table: "DailyPLs",
                column: "PortfolioId");

            migrationBuilder.CreateIndex(
                name: "IX_DailyTrades_PortfolioId",
                table: "DailyTrades",
                column: "PortfolioId");

            migrationBuilder.CreateIndex(
                name: "IX_Estimates_HierarchyId",
                table: "Estimates",
                column: "HierarchyId");

            migrationBuilder.CreateIndex(
                name: "IX_Portfolios_HierarchyId",
                table: "Portfolios",
                column: "HierarchyId");

            migrationBuilder.CreateIndex(
                name: "IX_UserGroupHierarchies_UserGroupId",
                table: "UserGroupHierarchies",
                column: "UserGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_UserUserGroups_UserGroupId",
                table: "UserUserGroups",
                column: "UserGroupId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailyPLs");

            migrationBuilder.DropTable(
                name: "DailyTrades");

            migrationBuilder.DropTable(
                name: "Estimates");

            migrationBuilder.DropTable(
                name: "UserGroupHierarchies");

            migrationBuilder.DropTable(
                name: "UserUserGroups");

            migrationBuilder.DropTable(
                name: "Portfolios");

            migrationBuilder.DropTable(
                name: "UserGroups");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Hierarchies");
        }
    }
}
