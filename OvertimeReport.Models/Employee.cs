using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OvertimeReport.Models {
    public class Employee {
        public int Id { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string ManagerId { get; set; }
        public bool IsManager { get; set; }
        public string Role { get; set; }
        public string Function { get; set; }
        public string SiteCodeAddress { get; set; }

    }
}
