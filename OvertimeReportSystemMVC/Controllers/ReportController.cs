﻿using System;
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

        public ReportController(IOvertimeRepository<Employee> employee, IOvertimeRepository<Attendance> attendance, IOvertimeRepository<BreakDownHours> breakdown, IOvertimeRepository<Site> site, IOvertimeRepository<OvertimeType> overtimeType) {
            _employee = employee;
            _attendance = attendance;
            _breakdown = breakdown;
            _overtimeType = overtimeType;
            _site = site;
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


 
        public string AddBreakDown([FromBody]List<BreakDownHours> breakDownHours) {
            try {
                foreach(var breakdown in breakDownHours) {
                    _breakdown.Add(breakdown);
                }
             
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