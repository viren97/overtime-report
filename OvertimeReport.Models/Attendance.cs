using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OvertimeReport.Models {
    public class Attendance {
        [Key]
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public DateTime WeekStart { get; set; }
        public DateTime WeekEnd { get; set; }
        public decimal OverTimeHour { get; set; }
        public bool Status { get; set; }
        public decimal BreakDownHour { get; set; }
   
    }
}
