
const uri = 'api/report/';
var ReportData = [];
var Employees = [];
var DisplayedEmployee = [];
let filteredDisplayedEmployee = [];
let isFilterOn = 0;
var BreakdownData = [];
let attendanceId = -1;
var pagination;
var breakdownCountToSave = 0;

const UserRole = {
    Manager: 'Manager',
    Employee: 'Employee'
}

const monthNames = ["January",
                    "February", 
                    "March", 
                    "April", 
                    "May", 
                    "June",
                    "July",
                    "August", 
                    "September",
                    "October",
                    "November",
                    "December"
];

var employeeAttendance = (id) => {
    let attendances = [];
    for (let j = 0; j < ReportData[0].attendance.length; j++){
        attendance = ReportData[0].attendance[j];
        if(id === attendance.employeeId){
            attendances.push(attendance);
        }
    }
    return attendances;
}

var generateEmployeeData = () => {
    let emp;
    let attendance;
    Employees.length = 0;
    for (let i = 0; i < ReportData[0].employees.length; i++){
        emp = ReportData[0].employees[i];
        var employee = {
            Id : emp.id,
            Firstname : emp.firstname,
            Lastname :  emp.lastname,
            Email : emp.email,
            ManagerId :  emp.managerId,
            IsManager : emp.isManager,
            Role :  emp.role,
            Function : emp.function,
            SiteCodeAddress :  emp.siteCodeAddress,
            Attendance : employeeAttendance(emp.id),
        }

        Employees.push(employee);
    }
    fetchYear();
    setMonth();
    console.log(Employees);

}

var GetAllData = () => {
    let url = uri + 'GetReport/';
    fetch(url).then(response => response.json()).then(data =>{
        ReportData.length = 0;
        ReportData.push(data)
    } ).then(data => this.generateEmployeeData())
        .catch(error => console.log(error));

};

var paginate = (totalRecord, pageSize = 10, currentPage = 1) => {
    let totalPage = Math.ceil(totalRecord / pageSize);
    let startIndex;
    let endIndex;

    if(currentPage < 1){
        currentPage = 1;
    } else if(currentPage > totalPage){
        currentPage = totalPage;
    }

    startIndex = (currentPage - 1) * pageSize;
    endIndex = Math.min(startIndex + pageSize - 1, totalRecord - 1);

    return {
        totalRecord : totalRecord,
        pageSize : pageSize,
        startIndex : startIndex,
        endIndex : endIndex,
        totalPage : totalPage,
        currentPage : currentPage,
    };

};


// name.innerHTML = emp.Firstname + ", " + emp.Lastname;
// employeeRole.innerHTML = emp.Role;
// func.innerHTML = emp.Function;
// address.innerHTML = emp.SiteCodeAddress;
// reminder.innerHTML = '<i class="fas fa-envelope"></i>';
// overtime.innerHTML = overtimeSum(emp.Attendance);
// breakdownhour.innerHTML = breakDownHourSum(emp.Attendance);
// status.innerHTML = isCompleted(emp.Attendance) ? "Completed" : "Pending";
// date.innerHTML = `${monthNames[weekStart.getMonth()]}, ${weekStart.getDate()} ${weekStart.getFullYear()} - ${monthNames[weekEnd.getMonth()]}, ${weekEnd.getDate()} ${weekEnd.getFullYear()}`  
// tr.id = emp.Id;
// date.classList.add(attendance.id);
// date.addEventListener('click',   getBreakDownInformation, false);

var modifyDisplayedRecord = (record) => {
    let resultantRecord = [];
    let emp;
    let weekStart, weekEnd;
    if(record === null || record.length === 0){
        return record;
    }
    if(typeof record[0].Attendance === 'undefined'){
        return record;
    }
  
    for(let i = 0; i<record.length; i++){
        emp = record[i];
        for(let j = 0; j<emp.Attendance.length; j++){
            //database entry is wrong for weekstart and weekend
            weekStart = new Date(emp.Attendance[j].weekStart);
            weekEnd = new Date(emp.Attendance[j].weekEnd);
            resultantRecord.push({
                empId : emp.Id,
                attendanceId : emp.Attendance[j].id,
                name : `${emp.Firstname}, ${emp.Lastname}`,
                role : emp.Role,
                function : emp.Function,
                siteCodeAddress : emp.SiteCodeAddress,
                overtime : overtimeSum(emp.Attendance),
                breakdownHour : breakDownHourSum(emp.Attendance),
                status : isCompleted(emp.Attendance[j]) ? 'Completed' : 'Pending',
                date : `${monthNames[weekStart.getMonth()]}, ${weekStart.getDate()} ${weekStart.getFullYear()} - ${monthNames[weekEnd.getMonth()]}, ${weekEnd.getDate()} ${weekEnd.getFullYear()}`  ,
                year : weekStart.getFullYear(),
                month : weekStart.getMonth(),
            });
        }
    }
    return resultantRecord;
}

var queryDetails = (query) => {
    let filterData = {
        SiteCodeAddress : document.getElementById('siteCodeAddress').value,
        Function : document.getElementById('function').value,
        Status : document.getElementById('status').value,
        Year : document.getElementById('year').value,
        Month : document.getElementById('month').value
    };

    query = document.getElementById('searchBox').value;

    let tempDisplayData = DisplayedEmployee.filter( employee => {
        let name = employee.name;
        return (name.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) !== -1 || (query === "")) ? true : false;
    }).filter(employee => {
        let filterFunction = filterData.Function.toLocaleLowerCase();
        let employeeFunction = employee.function.toLocaleLowerCase();
        return (filterFunction === employeeFunction || filterFunction === "all") ? true : false;
    }).filter(employee => {
        let filterSiteAddress = filterData.SiteCodeAddress.toLocaleLowerCase();
        let employeeSiteAddress = employee.siteCodeAddress.toLocaleLowerCase();
        return (filterSiteAddress === employeeSiteAddress || filterSiteAddress === "all") ? true : false;
    }).filter(employee => {
        let status = employee.status;
        let filterStatus = filterData.Status;
        return (status === filterStatus || filterStatus === "All") ? true : false;
    }).filter( employee => {
        let year = filterData.Year;
        return (year.toString() === employee.year.toString() || year === 'All') ? true : false;

    }).filter(employee => {
        let month = filterData.Month;
        return (monthNames[employee.month].toLocaleLowerCase() === month.toLocaleLowerCase() || month === 'All') ? true : false;
    })
    isFilterOn = 1;
    filteredDisplayedEmployee = modifyDisplayedRecord(tempDisplayData);
    pagination = paginate(filteredDisplayedEmployee.length);
    generatePageLink(pagination.totalPage);
    displayResult(tempDisplayData.slice(pagination.startIndex, pagination.endIndex + 1));
};




var filterBasedOnUserRole = (flag = 0) => {
    var userRole = document.getElementById('userRole').value;
    if (flag === 0) {
        populateSimulatedUser(userRole);    
        DisplayedEmployee.length = 0;
    }
  
    var userName = document.getElementById('simulateUser').value;
    document.getElementById('greetingUser').innerHTML = "Welcome " + userName;


    var employee;
    if (userRole === (UserRole.Manager)) {
        var user = getUserByUserName(userName);
        if (user !== null) {
            for (let i = 0; i < Employees.length; i++) {
                employee = Employees[i];
                if (user.id === employee.managerId) {
                    DisplayedEmployee.push(employee);
                }
            }
            calculateOvertime(DisplayedEmployee);
        } else {
            alert("No Employee Works Under You");
            setOvertimeDetails(0, 0, 0);
        }


    } else {
        DisplayedEmployee.length = 0;
        DisplayedEmployee.push(getUserByUserName(userName));
        calculateOvertime(DisplayedEmployee);
    }
    isFilterOn = 0;
    DisplayedEmployee = modifyDisplayedRecord(DisplayedEmployee);
    pagination = paginate(DisplayedEmployee.length);
    generatePageLink(pagination.totalPage);
    displayResult(DisplayedEmployee.slice(pagination.startIndex, pagination.endIndex + 1));
};

var getUserByUserName = (userName) => {
    var name;
    for (let i = 0; i < Employees.length; i++) {
        name = `${Employees[i].Firstname} ${Employees[i].Lastname}`;
        if (name.indexOf(userName) !== -1) {
            return Employees[i];
        }
    }
    return null;
};

var populateSimulatedUser = (userRole) => {
    let employee;
    document.getElementById('simulateUser').innerHTML = "";
    if (userRole === (UserRole.Employee)) {
        for (let i = 0; i < Employees.length; i++) {
            employee = Employees[i];
            if (employee.IsManager === false) {
                createOption(employee);
            }
        }
    } else {

        for (let i = 0; i < Employees.length; i++) {
            employee = Employees[i];
            if (employee.IsManager === true) {
                createOption(employee);
            }
        }
    }


};

var createOption = (employee) => {
    var option = document.createElement('option');
    option.value = employee.Firstname + " " + employee.Lastname;
    option.innerHTML = employee.Firstname + ", " + employee.Lastname;
    document.getElementById('simulateUser').appendChild(option);
};

var calculateOvertime = (DisplayedEmployee) => {
    let totalOvertime = 0, completed = 0, pending = 0;
    let employee;
    let attendance;
    for (let i = 0; i < DisplayedEmployee.length; i++) {
        employee = DisplayedEmployee[i];
        for (let j = 0; j < employee.Attendance.length; j++) {
            attendance = employee.Attendance[j];
            totalOvertime += attendance.overTimeHour;
            if (attendance.status === false) {
                pending += 1;
            }
            if (attendance.status === true) {
                completed += 1;
            }
        }
    }
    setOvertimeDetails(totalOvertime, completed, pending);
};
var setOvertimeDetails = (totalOvertime, completed, pending) => {
    document.getElementById('totalOvertime').innerHTML = 'Total OT Hours: ' + totalOvertime;
    document.getElementById('completedOvertime').innerHTML = 'Completed: ' + completed;
    document.getElementById('pendingOvertime').innerHTML = 'Pending: ' + pending;
};

// var pagination = (pageNumber)  => {
//     paginationSize = Number(pageNumber) * 10;
//     let len = DisplayedData.length;
//     pageCount = Math.ceil(len / 10);
//     if(pageCount > 1){
//         generatePageLink(pageCount);
//     }
//     if(paginationSize > len){
//         displayResult(displayedEmployee.slice(paginationSize - 10, len));
//     }
//     displayResult(DisplayedEmployee.slice(pageinationSize - 10, paginationSize)); 
// }

var generatePageLink = (pageCount) => {
    var a = document.createElement('a');
    var div = document.querySelector('.pagination');
    div.innerHTML = "";
    a.innerHTML = '<i class="fas fa-backward"></i>';
    a.onclick = prevPage;

    div.appendChild(a);
    for(let i = 0; i<pageCount; i++){
        a = document.createElement('a');
        a.innerHTML =  i + 1;
        a.onclick = changeCurrentPage;
        div.appendChild(a);
    }
    a = document.createElement('a');
    a.innerHTML = '<i class="fas fa-forward"></i>';
    a.onclick = nextPage;

    div.appendChild(a);
}

var changeCurrentPage = (e) => {
    let page = Number(e.target.innerHTML);
    renderResult(page);
}

var renderResult = (page) => {
    if(isFilterOn === 0){
        pagination = paginate(DisplayedEmployee.length, 10, page);
        displayResult(DisplayedEmployee.slice(pagination.startIndex, pagination.endIndex + 1));
    } else {
        pagination = paginate(filteredDisplayedEmployee.length, 10, page);
        displayResult(filteredDisplayedEmployee.slice(pagination.startIndex, pagination.endIndex + 1));
    }
}

var prevPage = () => {
    let currentPage = pagination.currentPage;
    if(currentPage <= 1){
        renderResult(currentPage);
    } else {
        renderResult(currentPage - 1);
    }
}

var nextPage = () => {
    let currentPage = pagination.currentPage;
    if(currentPage >= pagination.totalPage ){
        renderResult(currentPage);
    } else {
        renderResult(currentPage + 1);
    }
}


var displayResult = (displayedEmployee) => {
    document.getElementById('tableResult').innerHTML = "";
    var tr = document.createElement('tr');
    var name = document.createElement('th');
    var date = document.createElement('th');
    var overtime = document.createElement('th');
    var breakdownhour = document.createElement('th');
    var employeeRole = document.createElement('th');
    var func = document.createElement('th');
    var address = document.createElement('th');
    var status = document.createElement('th');
    var reminder = document.createElement('th');
    name.innerHTML = "Employee Name";
    date.innerHTML = 'Time Period';
    overtime.innerHTML = 'Overtime Hours';
    breakdownhour.innerHTML = 'Breakdown Hours';
    employeeRole.innerHTML = 'Employee Role';
    func.innerHTML = 'Function';
    address.innerHTML = 'Site Code-Address';
    status.innerHTML = 'Status';
    reminder.innerHTML = 'Send Reminder';
    tr.appendChild(name);
    tr.appendChild(date);
    tr.appendChild(overtime);
    tr.appendChild(breakdownhour);
    tr.appendChild(employeeRole);
    tr.appendChild(func);
    tr.appendChild(address);
    tr.appendChild(status);
    tr.appendChild(reminder);
    document.getElementById('tableResult').appendChild(tr);

    if (displayedEmployee.length === 0) {
        return;
    }

    var emp;
    for(let i = 0; i<displayedEmployee.length; i++){
        emp = displayedEmployee[i];
        tr = document.createElement('tr');
        name = document.createElement('td');
        date = document.createElement('td');
        overtime = document.createElement('td');
        breakdownhour = document.createElement('td');
        employeeRole = document.createElement('td');
        func = document.createElement('td');
        address = document.createElement('td');
        status = document.createElement('td');
        reminder = document.createElement('td');
        name.id = `employeeName${emp.empId}`;
        date.id = `timePeriod${emp.empId}`;
        overtime.id = `overtime${emp.empId}`;

        name.innerHTML = emp.name;
        employeeRole.innerHTML = emp.role;
        func.innerHTML = emp.function;
        address.innerHTML = emp.siteCodeAddress;
        reminder.innerHTML = '<i class="fas fa-envelope"></i>';
        overtime.innerHTML = emp.overtime;
        breakdownhour.innerHTML = emp.breakdownHour;
        status.innerHTML = emp.status;
        date.innerHTML = emp.date,
        tr.id = emp.empId;
        date.classList.add(emp.attendanceId);
        date.addEventListener('click',   getBreakDownInformation, false);

        changeStatusColor(status, emp.status);


        tr.appendChild(name);
        tr.appendChild(date);
        tr.appendChild(overtime);
        tr.appendChild(breakdownhour);
        tr.appendChild(employeeRole);
        tr.appendChild(func);
        tr.appendChild(address);
        tr.appendChild(status);
        tr.appendChild(reminder);
        document.getElementById('tableResult').appendChild(tr);
    }
}

var changeStatusColor = (statusTag, status) => {

    if(status.toLocaleLowerCase() === 'pending'){
        statusTag.style.color = 'red';
    } else {
        statusTag.style.color = 'green';
    }
}


var getBreakDownInformation = (ev) => {
    var id = ev.target.parentNode.id;
    attendanceId = Number(ev.target.classList[0]);
    var url = `${uri}GetBreakDownReport/${attendanceId}`;
    fetch(url, {
        method : 'Get',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        }
    }).then(d => d.json()).then(d => BreakdownData.push(d))
    .then(d => popupBreakdown(id))
    .catch(e => console.log(e));

}

var createHelpInfo = () => {

    var table = document.querySelector(".overtimeType-info");
    table.innerHTML = "";
    var helptext, index, category, trow;
    trow = document.createElement('tr');
    index = document.createElement('th');
    category = document.createElement('th');
    helptext = document.createElement('th');

    index.innerHTML = 'Index';
    category.innerHTML = 'Category';
    helptext.innerHTML = 'HelpText';
    trow.appendChild(index);
    trow.appendChild(category);
    trow.appendChild(helptext);
    table.appendChild(trow);

    // var overtimeCategory = document.getElementById('overtimeCategory');
    // var option;
    // overtimeCategory.innerHTML = "";
    // option = document.createElement('option');
    // option.value = 'select';
    // option.innerHTML = 'select';
    // overtimeCategory.appendChild(option);

    for(let i = 0; i<BreakdownData[0].overtimeTypes.length; i++){
        var type = BreakdownData[0].overtimeTypes[i];
        trow = document.createElement('tr');
        index = document.createElement('td');
        category = document.createElement('td');
        helptext = document.createElement('td');
        index.innerHTML = i;
        category.innerHTML = type.category;
        helptext.innerHTML = type.helpText;  
        trow.appendChild(index);
        trow.appendChild(category);
        trow.appendChild(helptext);
        table.appendChild(trow);
        // option = document.createElement('option');
        // option.value = type.category;
        // option.innerHTML =  type.category;
        // overtimeCategory.appendChild(option);

    }  
}


var popuateSiteAddresses = (id) => {
    var option; 
    var addresses = document.getElementById(id);
    // addresses.innerHTML = "";
    option = document.createElement('option');
    option.value = 'select';
    option.innerHTML = 'select';
    addresses.appendChild(option);
    for(let i = 0; i<BreakdownData[0].sites.length; i++){
        var site = BreakdownData[0].sites[i];
        option = document.createElement('option');
        option.value = `${site.code}-${site.address}`;
        option.innerHTML =  `${site.code}-${site.address}`;
        addresses.appendChild(option);
    }
}

var populateMinute = (id) => {
    var minute = document.getElementById(id);
    // minute.innerHTML = "";
    var option;
    for(let i = 0; i<=45; i+=15){
        option = document.createElement('option');
        option.value = i;
        option.innerHTML = i;
        minute.appendChild(option);
    }
}

var populateOvertimeCategory = (id) => {
    var option; 
    var category = document.getElementById(id);
    // category.innerHTML = "";
    option = document.createElement('option');
    option.value = 'select';
    option.innerHTML = 'select';
    category.appendChild(option);
    for(let i = 0; i<BreakdownData[0].overtimeTypes.length; i++){
        var c = BreakdownData[0].overtimeTypes[i];
        option = document.createElement('option');
        option.value = `${c.category}`;
        option.innerHTML =  `${c.category}`;
        category.appendChild(option);
    }
}

var popupBreakdown =  (id) => {
    createHelpInfo();
    // popuateSiteAddresses();
    // populateMinute();
    var simulateUser = document.getElementById('simulateUser').value;
    var empName = document.getElementById(`employeeName${id}`).innerHTML;
    var timePeriod = document.getElementById(`timePeriod${id}`).innerHTML;
    overtime = document.getElementById(`overtime${id}`).innerHTML;

    document.querySelector('.overlay').style.display = 'block';
    document.querySelector('.breakdown-container').style.display = 'block'; 
    document.querySelector('.breakdown-report').style.display = 'block';
    document.getElementById('greet').innerHTML = `Welcome ${simulateUser}`;
    document.getElementById('empName').innerHTML = empName;
    document.querySelector('.period').innerHTML = `Time Period: ${timePeriod}`;
  
    var table =  document.getElementById('breakdownTable');
    table.innerHTML = "";
    var tblrow, tbldata1, tbldata2, tbldata3, tbldata4;
    tblrow = document.createElement('tr');
    tbldata1 = document.createElement('th');
    tbldata2 = document.createElement('th');
    tbldata3 = document.createElement('th');
    tbldata4 = document.createElement('th');
    tbldata1.innerHTML = `Overtime Category <i class="fa fa-info-circle" aria-hidden="true" onmouseover='showHelp()' onmouseout='removeHelp()'></i>`;
    tbldata2.innerHTML = `Site Code (Address)`;
    tbldata3.innerHTML =  `Overtime Hour-Minutes`;
    tbldata4.innerHTML = `Comments`;

    tblrow.appendChild(tbldata1);
    tblrow.appendChild(tbldata2);
    tblrow.appendChild(tbldata3);
    tblrow.appendChild(tbldata4);
    table.appendChild(tblrow);


    let breakdownHour =  populateContent();
    document.querySelector('.hours').innerHTML = `${breakdownHour} / ${overtime}`;
    if(overtime <= breakdownHour){
        let tableRows = document.getElementById('tableResult').rows;
        for(let i = 1; i<tableRows.length; i++){
            if(tableRows[i].id === id){
                tableRows[i].childNodes[7].innerHTML = 'Completed';
                changeStatusColor(tableRows[i].childNodes[7]);
            }
        }
    }


    
}

var populateContent = () => {
    // BreakdownData[BreakdownData.length - 1].breakDownOfHours.forEach(createTableContent);
    var item;
    var tblrow, tbldata1, tbldata2, tbldata3, tbldata4, span, otHour, otComment;
    var otCategorySelect, otSiteAdd, otMinute;
    var option;
    var table =  document.getElementById('breakdownTable');
    var trashAndComment, p;
    let breakdownHour = 0;

    for(let i = 0; i< BreakdownData[BreakdownData.length - 1].breakdownOfHours.length; i++){
        item =  BreakdownData[BreakdownData.length - 1].breakdownOfHours[i];
        breakdownHour += item.hour;
        tblrow = document.createElement('tr');
        tbldata1 = document.createElement('td');
        tbldata2 = document.createElement('td');
        tbldata3 = document.createElement('td');
        tbldata4 = document.createElement('td');
        span = document.createElement('span');
        otHour = document.createElement('input');
        otComment = document.createElement('input');
        otCategorySelect = document.createElement('select');
        otSiteAdd =  document.createElement('select');
        otMinute = document.createElement('select');

        otMinute.setAttribute('id', `minute${item.id}`);
        otMinute.setAttribute('name', 'minute');

        otCategorySelect.setAttribute('name', 'ovetimeCategory');
        otCategorySelect.setAttribute('id', `overtimeCategory${item.id}`);

        otSiteAdd.setAttribute('name', 'siteAdd');
        otSiteAdd.setAttribute('id', `siteAdd${item.id}`);

        span.classList.add('ovetime-hour');
        otHour.setAttribute('type', 'text');
        otHour.setAttribute('name', 'hr');
        otHour.classList.add('ot-hour')
        otHour.setAttribute('placeholder', 'hrs');

        otComment.setAttribute('type', 'text');
        otComment.setAttribute('name', 'comment');
        otComment.classList.add('ot-comment')
        otComment.setAttribute('placeholder', 'Comments');

        otComment.value = item.comment;
        otHour.value = item.hour.toString().split('.')[0];

        option = document.createElement('option');
        option.value = item.overtimeType;
        option.innerHTML = item.overtimeType;

        otCategorySelect.appendChild(option);

        option = document.createElement('option');
        option.value = item.siteAddress;
        option.innerHTML = item.siteAddress;
        otSiteAdd.appendChild(option);

        option = document.createElement('option');
        option.value = item.hour.toString().split('.')[1];
        option.innerHTML = item.hour.toString().split('.')[1];
        otMinute.appendChild(option);
        span.appendChild(otHour);
        span.appendChild(otMinute);

        otSiteAdd.classList.add('site-add');
        otCategorySelect.classList.add('ot-category');
        otMinute.classList.add('ot-minute')

        trashAndComment = document.createElement('span');
        trashAndComment.appendChild(otComment);
        trashAndComment.id = item.id;
        p = document.createElement('p');
        p.innerHTML = '<i class="far fa-trash-alt" ></i>'
        p.id = i;
        p.onclick = removeRow;
        trashAndComment.appendChild(p);
        trashAndComment.classList.add('items')
        p.classList.add('delete-icon');

        tbldata1.appendChild(otCategorySelect);
        tbldata2.appendChild(otSiteAdd);
        tbldata3.appendChild(span);
        tbldata4.appendChild(trashAndComment);
     

        tblrow.appendChild(tbldata1);
        tblrow.appendChild(tbldata2);
        tblrow.appendChild(tbldata3);
        tblrow.appendChild(tbldata4);
     table.appendChild(tblrow);

     populateMinute(`minute${item.id}`);
     popuateSiteAddresses(`siteAdd${item.id}`);
     populateOvertimeCategory(`overtimeCategory${item.id}`);

    }

    return breakdownHour;
};

var removeRow = (e) => {
    var rowId = Number(e.target.id);
    var recordId = e.target.parentNode.tagName.toLocaleLowerCase() === 'p' ? Number(e.target.parentNode.parentNode.id) : Number(e.target.parentNode.id) ;
    let trow = e.target.parentElement.parentElement.parentElement.parentElement;
    var url = `${uri}DeleteBreakdownRecord/${recordId}`;
    fetch(url, {
        method : 'DELETE',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
    }).then(() => {
        trow.parentNode.removeChild(trow);
    })
}



var showHelp = () => {    
   document.querySelector('.overtimeType-info').style.display = 'block';
   
}

var removeHelp = () => {
    document.querySelector('.overtimeType-info').style.display = 'none';
}

var overtimeSum = (attendance) => {
    let time = 0;
    for (let i = 0; i < attendance.length; i++) {
        time += attendance[i].overTimeHour;
    }
    return time;
}

var breakDownHourSum = (attendance) => {
    let time = 0;
    for (let i = 0; i < attendance.length; i++) {
        time += attendance[i].breakDownHour;
    }
    return time;
}

var isCompleted = (attendance) => {
    if(attendance.status === true){
        return true;
    } 
    return false;

}


var clearFilterOption = () => {
    document.getElementById('searchBox').value = "";
    document.getElementById('division').value = document.getElementById('defaultDivision').value;
    document.getElementById('market').value = document.getElementById('defaultMarket').value;
    document.getElementById('siteCodeAddress').value = document.getElementById('defaultSiteAddress').value;
    document.getElementById('function').value = document.getElementById('defaultFunction').value;
    document.getElementById('status').value = document.getElementById('defaultStatus').value;
    document.getElementById('year').value = document.getElementById('defaultYear').value;
    document.getElementById('month').value = document.getElementById('defaultMonth').value;

};


var setMonth = () => {
    var year = document.getElementById('year');
    var month = document.getElementById('month');
    month.innerHTML = "";
    var option = document.createElement('option');
    option.value = 'All';
    option.innerHTML = "All";
    month.appendChild(option);
    var today = new Date();
    var currentMonth = today.getMonth();
    var currentYear = today.getFullYear();
    
    var selectedYear = year.value;
    if(selectedYear === currentYear.toString()){
        for(let i = currentMonth; i>=0; i--){
             option = document.createElement('option');
            option.value = monthNames[i];
            option.innerHTML = monthNames[i];
            month.appendChild(option);
        }
    } else {
        for(let i = 0; i<12; i++){
             option = document.createElement('option');
            option.value = monthNames[i];
            option.innerHTML = monthNames[i];
            month.appendChild(option);
        }
    }

    

};

var fetchYear = () => {
    var url = `${uri}getyears`;
    fetch(url, {
        method : 'get',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        }
    }
      ).then(r => r.json()).then( r => setYear(r)).catch(e => alert(e));
}

var setYear = (years) => {

    var year = document.getElementById('year');
    let setValue;
    var option;
    for(let i = 0; i<years.length; i++){
        option = document.createElement('option');
        option.value = years[i].year;
        option.innerHTML = years[i].year;     
        year.appendChild(option);
        if(years[i].isActive === true){
            setValue = years[i].year;
        }
    }

    for(let i = 0; i<year.options.length; i++){
        if(year.options[i].value === setValue.toString()){
            year.options[i].selected = true;
        }
    }
    setMonth();
    
    year.addEventListener('change', setMonth, false);
};

// public int Id { get; set; }
// public int AttendanceId { get; set; }
// public decimal Hour { get; set; }
// public DateTime Datetime { get; set; }
// public string Comment { get; set; }
// public string OvertimeType { get; set; }
// public string SiteAddress { get; set; }


var saveBreakDownData = () => {
    var date = new Date();
    let breakdowns = [];
    let table = document.getElementById('breakdownTable');
    let toSaveBreakdowns = table.rows;
    // let toSaveBreakdowns = document.querySelectorAll('.to-save');
    let breakdown;
    let row, hour,id;
    for(let i = 1; i<toSaveBreakdowns.length; i++){
        row = toSaveBreakdowns[i];
        hour = `${row.childNodes[2].childNodes[0].childNodes[0].value}.${row.childNodes[2].childNodes[0].childNodes[1].value}`;
        id = Number(row.cells[3].childNodes[0].id);
        breakdown = {
            Id :  id,
            AttendanceId : attendanceId,
            OvertimeType : row.childNodes[0].childNodes[0].value,
            SiteAddress : row.childNodes[1].childNodes[0].value,
            Datetime : date,
            Comment : row.childNodes[3].childNodes[0].childNodes[0].value,
            Hour : Number(hour),
        }

        breakdowns.push(breakdown);    
    }
 
    let url = `${uri}AddBreakDown`;
    
    fetch(url, {
        method : "POST",
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(breakdowns),
    }).then(function() {
        closeBreakdownPage();
        
    }).then(r => alert('success')).then(GetAllData).then(filterBasedOnUserRole).catch(e => alert('error' + e));
};

var closeBreakdownPage = () => {
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.breakdown-container').style.display = 'none'; 
    document.querySelector('.breakdown-report').style.display = 'none';
}

var addRowToTable = () => {
    var tblrow, tbldata1, tbldata2, tbldata3, tbldata4, span, otHour, otComment;
    var otCategorySelect, otSiteAdd, otMinute;
    let trashAndComment, p;
    var table =  document.getElementById('breakdownTable');
    tblrow = document.createElement('tr');
    tbldata1 = document.createElement('td');
    tbldata2 = document.createElement('td');
    tbldata3 = document.createElement('td');
    tbldata4 = document.createElement('td');
    span = document.createElement('span');
    otHour = document.createElement('input');
    otComment = document.createElement('input');
    otCategorySelect = document.createElement('select');
    otSiteAdd =  document.createElement('select');
    otMinute = document.createElement('select');

    tblrow.classList.add('to-save');

    otMinute.setAttribute('id', `minute${breakdownCountToSave}`);
    otMinute.setAttribute('name', 'minute');

    otCategorySelect.setAttribute('name', 'ovetimeCategory');
    otCategorySelect.setAttribute('id', `overtimeCategory${breakdownCountToSave}`);

    otSiteAdd.setAttribute('name', 'siteAdd');
    otSiteAdd.setAttribute('id', `siteAdd${breakdownCountToSave}`);

    otSiteAdd.classList.add('site-add');
    otCategorySelect.classList.add('ot-category');
    otMinute.classList.add('ot-minute')

    span.classList.add('ovetime-hour');
    otHour.setAttribute('type', 'text');
    otHour.setAttribute('name', 'hr');
    otHour.classList.add('ot-hour');
    otHour.setAttribute('placeholder', 'hrs');

    otComment.setAttribute('type', 'text');
    otComment.setAttribute('name', 'comment');
    otComment.setAttribute('placeholder', 'Comments');
    otComment.classList.add('ot-comment')
    span.appendChild(otHour);
    span.appendChild(otMinute);

    
    trashAndComment = document.createElement('span');
    trashAndComment.appendChild(otComment);
    p = document.createElement('p');
    p.innerHTML = '<i class="far fa-trash-alt" ></i>'
    p.id = document.getElementById('breakdownTable').rows.length;
    p.onclick = removeRow;
    trashAndComment.appendChild(p);
    trashAndComment.classList.add('items')
    p.classList.add('delete-icon');

    tbldata1.appendChild(otCategorySelect);
    tbldata2.appendChild(otSiteAdd);
    tbldata3.appendChild(span);
    tbldata4.appendChild(trashAndComment);
 

    tblrow.appendChild(tbldata1);
    tblrow.appendChild(tbldata2);
    tblrow.appendChild(tbldata3);
    tblrow.appendChild(tbldata4);


   table.appendChild(tblrow);

   populateMinute(`minute${breakdownCountToSave}`);
   popuateSiteAddresses(`siteAdd${breakdownCountToSave}`);
   populateOvertimeCategory(`overtimeCategory${breakdownCountToSave}`);
   breakdownCountToSave += 1;
   
}

