using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace OvertimeReport.Models {
    public class Years {
        [Key]
        public int Id { get; set; }
        public int Year { get; set; }
        public bool IsActive { get; set; }
    }
}
