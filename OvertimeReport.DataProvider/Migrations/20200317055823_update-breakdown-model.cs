using Microsoft.EntityFrameworkCore.Migrations;

namespace OvertimeReport.DataProvider.Migrations
{
    public partial class updatebreakdownmodel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SiteAddress",
                table: "BreakDownHours",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SiteAddress",
                table: "BreakDownHours");
        }
    }
}
