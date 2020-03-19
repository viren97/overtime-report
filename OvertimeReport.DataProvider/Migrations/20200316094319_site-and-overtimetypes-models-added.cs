using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OvertimeReport.DataProvider.Migrations
{
    public partial class siteandovertimetypesmodelsadded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "Date",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "EffectiveWorkHour",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "EntryTime",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "ExitTime",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "GrossWorkHour",
                table: "Attendances");

            migrationBuilder.AddColumn<int>(
                name: "AttendanceId",
                table: "BreakDownHours",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "WeekEnd",
                table: "Attendances",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "WeekStart",
                table: "Attendances",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AttendanceId",
                table: "BreakDownHours");

            migrationBuilder.DropColumn(
                name: "WeekEnd",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "WeekStart",
                table: "Attendances");

            migrationBuilder.AddColumn<int>(
                name: "BreakDownOfHoursId",
                table: "Attendances",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "Attendances",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "EffectiveWorkHour",
                table: "Attendances",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "EntryTime",
                table: "Attendances",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ExitTime",
                table: "Attendances",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "GrossWorkHour",
                table: "Attendances",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

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
    }
}
