using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OvertimeReport.DataProvider.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Attendances",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<int>(nullable: false),
                    Date = table.Column<DateTime>(nullable: false),
                    EntryTime = table.Column<DateTime>(nullable: false),
                    ExitTime = table.Column<DateTime>(nullable: false),
                    GrossWorkHour = table.Column<decimal>(nullable: false),
                    EffectiveWorkHour = table.Column<decimal>(nullable: false),
                    OverTimeHour = table.Column<decimal>(nullable: false),
                    Status = table.Column<bool>(nullable: false),
                    BreakDownHour = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attendances", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Firstname = table.Column<string>(nullable: true),
                    Lastname = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    ManagerId = table.Column<string>(nullable: true),
                    IsManager = table.Column<bool>(nullable: false),
                    Role = table.Column<string>(nullable: true),
                    Function = table.Column<string>(nullable: true),
                    SiteCodeAddress = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BreakDownHours",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Hour = table.Column<decimal>(nullable: false),
                    Datetime = table.Column<DateTime>(nullable: false),
                    Comment = table.Column<string>(nullable: true),
                    OvertimeType = table.Column<string>(nullable: true),
                    AttendanceId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BreakDownHours", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BreakDownHours_Attendances_AttendanceId",
                        column: x => x.AttendanceId,
                        principalTable: "Attendances",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BreakDownHours_AttendanceId",
                table: "BreakDownHours",
                column: "AttendanceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BreakDownHours");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "Attendances");
        }
    }
}
