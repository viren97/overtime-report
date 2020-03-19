
using Microsoft.EntityFrameworkCore;
using OvertimeReport.Models;

namespace OvertimeReport.DataProvider {
    public class OvertimeContext : DbContext {
        public OvertimeContext(DbContextOptions<OvertimeContext> option) : base(option) {

        }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<BreakDownHours> BreakDownHours { get; set; }
        public DbSet<Site> Sites { get; set; }
        public DbSet<OvertimeType> OvertimeTypes { get; set; }
        public DbSet<Years> Years { get; set; }
      
    }
}
