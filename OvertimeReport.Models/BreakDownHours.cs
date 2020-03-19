using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OvertimeReport.Models {
    public class BreakDownHours {
        [Key]
        public int Id { get; set; }
        public int AttendanceId { get; set; }
        public decimal Hour { get; set; }
        public DateTime Datetime { get; set; }
        public string Comment { get; set; }
        public string OvertimeType { get; set; }
        public string SiteAddress { get; set; }
    }
}

