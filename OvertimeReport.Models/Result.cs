using System;
using System.Collections.Generic;
using System.Text;

namespace OvertimeReport.Models {
    public class ReportResult {
        public List<Employee> Employees { get; set; }
        public List<Attendance> Attendance { get; set; }
        public ReportResult(List<Employee> employees, List<Attendance> attendances) {
            Employees = employees;
            Attendance = attendances;
        }
    }
}
