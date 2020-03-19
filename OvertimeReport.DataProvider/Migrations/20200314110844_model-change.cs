using Microsoft.EntityFrameworkCore.Migrations;

namespace OvertimeReport.DataProvider.Migrations
{
    public partial class modelchange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BreakDownHours_Attendances_AttendanceId",
                table: "BreakDownHours");

            migrationBuilder.DropIndex(
                name: "IX_BreakDownHours_AttendanceId",
                table: "BreakDownHours");

            migrationBuilder.DropColumn(
                name: "AttendanceId",
                table: "BreakDownHours");

            migrationBuilder.AddColumn<int>(
                name: "BreakDownOfHoursId",
                table: "Attendances",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_BreakDownOfHoursId",
                table: "Attendances",
                column: "BreakDownOfHoursId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendances_BreakDownHours_BreakDownOfHoursId",
                table: "Attendances",
                column: "BreakDownOfHoursId",
                principalTable: "BreakDownHours",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendances_BreakDownHours_BreakDownOfHoursId",
                table: "Attendances");

            migrationBuilder.DropIndex(
                name: "IX_Attendances_BreakDownOfHoursId",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "BreakDownOfHoursId",
                table: "Attendances");

            migrationBuilder.AddColumn<int>(
                name: "AttendanceId",
                table: "BreakDownHours",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_BreakDownHours_AttendanceId",
                table: "BreakDownHours",
                column: "AttendanceId");

            migrationBuilder.AddForeignKey(
                name: "FK_BreakDownHours_Attendances_AttendanceId",
                table: "BreakDownHours",
                column: "AttendanceId",
                principalTable: "Attendances",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
