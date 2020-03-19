using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using OvertimeReport.DataProvider;
using OvertimeReport.Models;

namespace OvertimeReportSystem.Controllers
{
    [Route("api/{controller}/{action}/{id?}")]
    [ApiController]
    public class ReportController : ControllerBase
    {

        private readonly IOvertimeRepository<Employee> _employee = null;
        private readonly IOvertimeRepository<Attendance> _attendance = null;
        private readonly IOvertimeRepository<BreakDownHours> _breakdown = null;
        private readonly IOvertimeRepository<Site> _site = null;
        private readonly IOvertimeRepository<OvertimeType> _overtimeType = null;
        private readonly IOvertimeRepository<Years> _year = null;

        public ReportController(IOvertimeRepository<Years> year,IOvertimeRepository<Employee> employee, IOvertimeRepository<Attendance> attendance, IOvertimeRepository<BreakDownHours> breakdown, IOvertimeRepository<Site> site, IOvertimeRepository<OvertimeType> overtimeType) {
            _employee = employee;
            _attendance = attendance;
            _breakdown = breakdown;
            _overtimeType = overtimeType;
            _site = site;
            _year = year;
        }

        public IActionResult GetReport() {

            try {
                List<Employee> employees = _employee.GetAll().ToList();
                List<Attendance> attendances = _attendance.GetAll().ToList();

                if (employees != null && attendances != null) {
                    return Ok(new ReportResult(employees, attendances));
                }
                else {
                    return null;
                }
            } catch(Exception e) {
                return BadRequest(e);
            }
      
        }

        public IActionResult GetBreakDownReport([FromRoute] int id) {
            try {
                List<BreakDownHours> breakDownHours = _breakdown.GetAll().Where(b => b.AttendanceId == id).ToList();
                List<Site> sites = _site.GetAll().ToList();
                List<OvertimeType> overtimeType = _overtimeType.GetAll().ToList();

                return Ok(new BreakdownReport(sites, overtimeType, breakDownHours));

            } catch(Exception e) {
                return BadRequest(e);
            }


        }

        public IActionResult GetYears() {
            try {
                return Ok(_year.GetAll());
            } catch(Exception e) {
                return NotFound(e);
            }
          
        }


 
        public string AddBreakDown([FromBody]List<BreakDownHours> breakDownHours) {
            List<BreakDownHours> toUpdateBreakdown = new List<BreakDownHours>();
            List<BreakDownHours> toAddBreakdown = new List<BreakDownHours>();
            decimal totalBreakdownHour = 0;
            decimal attendanceId = 0;
            foreach (var breakdown in breakDownHours) {
                totalBreakdownHour += breakdown.Hour;
                attendanceId = breakdown.AttendanceId;
                if (breakdown.Id == 0) {
                    toAddBreakdown.Add(new BreakDownHours() {
                        AttendanceId = breakdown.AttendanceId,
                        Hour = breakdown.Hour,
                        Comment = breakdown.Comment,
                        OvertimeType = breakdown.OvertimeType,
                        SiteAddress = breakdown.SiteAddress,
                        Datetime = breakdown.Datetime

                    });
                } else {
                    toUpdateBreakdown.Add(breakdown);
                }
            }
            try {
                var attendanceOfUserById = _attendance.GetAll().FirstOrDefault(a => a.Id == attendanceId);
                if(attendanceOfUserById.OverTimeHour <= totalBreakdownHour) {
                    attendanceOfUserById.Status = true;
   
                } else if (attendanceOfUserById.OverTimeHour < totalBreakdownHour){
                    attendanceOfUserById.Status = false;
              
                }
                _attendance.Update(attendanceOfUserById);
                _breakdown.AddRangeOfBreakdowns(toAddBreakdown);
                _breakdown.UpdateRangeOfBreakdowns(toUpdateBreakdown);    
                 return "Successfully Created";
            } catch(Exception e) {
                return e.Message;
            }
       
        }

        public string DeleteBreakdownRecord([FromRoute] int id) {
            try {
                _breakdown.Delete(id);
                return "Record Deleted Successfully!";
            } catch(Exception e) {
                return e.Message;
            }

        }

    }
}
