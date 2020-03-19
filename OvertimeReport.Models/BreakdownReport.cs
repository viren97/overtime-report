using System;
using System.Collections.Generic;
using System.Text;

namespace OvertimeReport.Models {
    public class BreakdownReport {
        public List<Site> Sites { get; set; }
        public List<OvertimeType> OvertimeTypes { get; set; }
        public List<BreakDownHours> BreakdownOfHours { get; set; }


        public BreakdownReport(List<Site> sites, List<OvertimeType> overtimeTypes, List<BreakDownHours> breakdownHours ) {
            Sites = sites;
            OvertimeTypes = overtimeTypes;
            BreakdownOfHours = breakdownHours;

        }
    }
}
