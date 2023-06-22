const closeAddEmp = document.querySelector("[close]");

const addNewEmp = document.querySelector("[addNewEmp]");

const addEmpForm = document.querySelector(".addEmp");

const employeesSection = document.querySelector("section.employees");

const modal = document.querySelector(".modal");


const deleteSelectedBtn = document.querySelector("[deleteGlobal]");

const categoryCheckBox = document.querySelector(".category input");

const addEmployeeBtn = document.querySelector("[addEmployeeBtn]")

// New Employee Data in Add Form
const employeeName = document.querySelector("[employeeName]");
const employeeEmail = document.querySelector("[employeeEmail]");
const employeeAddress = document.querySelector("[employeeAddress]");
const employeePhone = document.querySelector("[employeePhone]");
// 

let employees =JSON.parse(localStorage.getItem("employees")) || [];

let checkedElements = [];
// Select All or Delete All
function loadEmployeesData() {


      employees.forEach(employee => {
        const newEmployee = document.createElement("div");
        newEmployee.innerHTML = addEmployee({
          name: employee.name,
          email: employee.Email,
          address: employee.Address,
          phone: employee.Phone
        });
        employeesSection.append(newEmployee);
        const newlyAddedEmployee = newEmployee;
        attachEditDeleteListeners(newlyAddedEmployee);
      });
    

}

window.addEventListener("DOMContentLoaded",loadEmployeesData)

categoryCheckBox.addEventListener("change", () => {
    const employees = document.querySelectorAll(".employee");

    if (categoryCheckBox.checked) {
        employees.forEach(employee => {
            employee.querySelector("input").checked = true;
            checkedElements.push(employee);

        })
    } else {
        employees.forEach(employee => {
            employee.querySelector("input").checked = false;
            checkedElements = checkedElements.filter(e => e !== employee);
        })
    }
})

function removeCheckedElements(checkedElements) {
    checkedElements.forEach(checkedElement => {
        checkedElement.remove();
    })
    if (categoryCheckBox.checked) {
        categoryCheckBox.checked = false;
    }

}
function attachEditDeleteListeners(employee) {
  const deleteBtn = employee.querySelector("[delete]");
  const editBtn = employee.querySelector("[edit]");
  const input = employee.querySelector("input");

  deleteBtn.addEventListener("click", () => {
    Delete(employee);
  });

  editBtn.addEventListener("click", () => {
    Edit(employee);
  });

  input.addEventListener("change", () => {
    if (input.checked) {
      checkedElements.push(employee);
    } else {
      checkedElements = checkedElements.filter((e) => e !== employee);
    }
  });
}
deleteSelectedBtn.addEventListener("click", () => removeCheckedElements(checkedElements));

function Hide() {


    addEmpForm.classList.remove("show");
    modal.classList.remove("show");
}
closeAddEmp.addEventListener("click", Hide)
modal.addEventListener("click", Hide)

addNewEmp.addEventListener("click", () => {
    addEmpForm.classList.add("show");
    modal.classList.add("show");
})

function Delete(element) {
    const elName = element.querySelector("p:first-of-type").textContent;
    const index=employees.findIndex(data=>data.name===elName)
    if (index > -1) {
        const filteredemployeesData = employees.filter((data,i)=>i!==index);
        localStorage.removeItem("employees");
        localStorage.setItem("employees",JSON.stringify(filteredemployeesData));

    }
    element.remove();    
}

function Edit(element) {

    const employeeName = element.querySelector("p:nth-of-type(1)");
    const employeeEmail = element.querySelector("p:nth-of-type(2)");
    const employeeAddress = element.querySelector("p:nth-of-type(3)");
    const employeePhone = element.querySelector("p:nth-of-type(4)");
    const idxOfElementInLocStorage = employees.findIndex((data,i) => data.name == employeeName.textContent);
    const pElements = element.querySelectorAll("p:not(:last-of-type)");
    const edit = element.querySelector("[edit]");
    const returnToNormal = () => {

        edit.textContent = "Edit";
        pElements.forEach(p => {
            p.contentEditable = "false";
        })
        
        edit.addEventListener("click", startEditing);
        edit.removeEventListener("click", returnToNormal);
    }
    const startEditing = () => {
        edit.textContent = "Editing...";
        pElements.forEach(p => {
            p.contentEditable = "true";
        });
        edit.removeEventListener("click", startEditing);
        edit.addEventListener("click", returnToNormal);
        updateLocaleStorage({
            employees,
            employeeName,
            employeeEmail,
            employeeAddress,
            employeePhone,
            idxOfElementInLocStorage
        });

    }

    edit.addEventListener("click", startEditing);

}
function updateLocaleStorage({ employees
    , employeeName
    , employeeEmail
    , employeeAddress
    , employeePhone
    , idxOfElementInLocStorage }) {
    
        const updatedEmployees = employees;
        updatedEmployees[idxOfElementInLocStorage].name = employeeName.textContent;
        updatedEmployees[idxOfElementInLocStorage].Email = employeeEmail.textContent;
        updatedEmployees[idxOfElementInLocStorage].Address = employeeAddress.textContent;
        updatedEmployees[idxOfElementInLocStorage].Phone = employeePhone.textContent;
        localStorage.removeItem("employees");
        localStorage.setItem("employees", JSON.stringify(updatedEmployees));
}
addEmployeeBtn.addEventListener("click", () => {
    let newEmployee = document.createElement("div");
    if (employeeName.value !== ""
        && employeeEmail.value !== ""
        && employeeAddress.value !== ""
        && employeePhone.value !== ""
    ) {
        newEmployee.innerHTML = addEmployee({
        name: employeeName.value,
        email: employeeEmail.value,
        address: employeeAddress.value,
        phone: employeePhone.value
            
        })
        
    employeesSection.append(newEmployee);
        const newlyAddedEmployee = newEmployee;
        employees.push({name: employeeName.value,
        Email: employeeEmail.value,
        Address: employeeAddress.value,
        Phone: employeePhone.value});
        localStorage.setItem("employees",JSON.stringify(employees));
        attachEditDeleteListeners(newlyAddedEmployee);
        employeeName.value = "";
        employeeEmail.value = "";
        employeeAddress.value = "";
        employeePhone.value = "";
        Hide();
        
    }

})

function addEmployee({
    name,
    email,
    address,
    phone
}) {
    return `
    <div class="employee">
           <input type="checkbox">
            <p>${name}</p>
            <p>${email}</p>
            <p>${address}</p>
            <p>${phone}</p>
            <p><button edit>Edit</button> <button delete>Delete</button></p>
    </div>
        `
}