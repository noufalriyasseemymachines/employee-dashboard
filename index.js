const employeeApi = "https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee";

const addButton = document.getElementById("add-button");
const modal = document.getElementById("modal");
const closeButton = document.getElementById("close-modal");
const filterDropdown = document.getElementById("filter-type");
const filterInput = document.getElementById("filter-input");
const snackbar = document.getElementById("snackbar"); 
const submitButton=document.getElementById("submit-btn")
const confirmationModal = document.getElementById("confirmation-modal");
const confirmYesButton = document.getElementById("confirm-yes");
const confirmNoButton = document.getElementById("confirm-no");
const logoutButton=document.getElementById("logout-button")

window.onload=checkLogin

const loginSuccess=localStorage.getItem("isLoginSuccess");
if(loginSuccess==="true"){
    displaySnackbar("Logged Succesfully",true)
    localStorage.removeItem("isLoginSuccess")
}

function checkLogin(){
    const isLoggedIn=getCookie("isLoggedIn")
    if(isLoggedIn!=="true"){
        window.location.href="register.html"
        displaySnackbar("Login and Continue",false)
    }
}

function getCookie(name){
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArr = decodedCookie.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].trim();
        if (cookie.indexOf(name + "=") == 0) {
            return cookie.substring(name.length + 1);
        }
    }
    return "";
}

function setCookie(name,value,days){
    const date=new Date()
    date.setTime(date.getTime()+(days*24*60*60*1000))
    const expires=`expires=${date.toUTCString()}`
    document.cookie=`${name}=${value};${expires};path=/`
}

logoutButton.addEventListener("click",function(){
    setCookie("isLoggedIn","false",0)
    window.location.href="register.html"
})

addButton.addEventListener("click", function () {
    document.getElementById("employee-id").value=""
    document.getElementById("name").value=""
    document.getElementById("age").value=""
    document.getElementById("designation").value=""
    modal.style.display = "flex"
    submitButton.style.display="block"
});

closeButton.addEventListener("click", function () {
    modal.style.display = "none";
    document.getElementById("employee-form").reset();

});

document.getElementById("employee-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const id = document.getElementById("employee-id").value;
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const designation = document.getElementById("designation").value;
    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(name)) {
        displaySnackbar("Name can only contain letters and spaces.", false);
        this.reset();
    } else {
        if (id) {
            editEmployee(id, { name, age, designation });
        } else {
            addEmployee({ name, age, designation });
        }
        this.reset();
        modal.style.display = "none";
    }
});

filterInput.addEventListener("input", fetchApi);
filterDropdown.addEventListener("change", fetchApi);
async function fetchApi() {
    try {
        const response = await fetch(employeeApi);
        if (!response.ok) {
            throw new Error("Network Error");
        }
        const data = await response.json();

        const filterType = filterDropdown.value;
        const filterValue = filterInput.value.toLowerCase();
        const filteredData = ((filterType === "" && filterValue === "") || (filterType === "" && filterValue !== "") || (filterType==="name" && filterValue==="") || (filterType==="designation" && filterValue===""))  ? data :
            data.filter(employe => {
                return (filterType === "name" && employe.name.toLowerCase().startsWith(filterValue)) ||
                    (filterType === "designation" && employe.designation.toLowerCase().startsWith(filterValue));
            });
        if (filteredData.length > 0) {
            displayEmployee(filteredData);
        } else {
            displayEmployee([])
            displaySnackbar("Search result Not Found", false);
        }
    } catch (error) {
        displaySnackbar(error.message, false);
    }
}

function displaySnackbar(message, isSuccess = false) {
    snackbar.textContent = message;
    snackbar.className = isSuccess ? "show success" : "show error";
    snackbar.style.visibility = "visible";
    snackbar.style.opacity = "1";
    setTimeout(() => {
        snackbar.className = "";
        snackbar.style.visibility = "hidden";
        snackbar.style.opacity = "0"; 
    }, 2000);
}

function displayEmployee(employeData) {
    const employeeList = document.getElementById("employee-list");
    employeeList.innerHTML = "";
    if(employeData.length>0){
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        thead.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Designation</th>
            <th>Edit</th>
            <th>Delete</th>
        </tr>
            `;
        table.appendChild(thead);
        const tbody = document.createElement("tbody");
        employeData.forEach((employ) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td data-label="Name">${employ.name}</td>
            <td data-label="Age">${employ.age}</td>
            <td data-label="Designation">${employ.designation}</td>
            <td data-label="Edit">
                <button class="edit-btn" onclick="updateForm('${employ.id}', '${employ.name}', '${employ.age}', '${employ.designation}')">Edit</button>
            </td>
            <td data-label="Delete">
                <button class="delete-btn" onclick="showDeleteMessage('${employ.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
        });

        table.appendChild(tbody);
        employeeList.appendChild(table);
    }
    else{
        const noDataToShow=document.createElement("p")
        noDataToShow.textContent=""
        employeeList.appendChild(noDataToShow)
    }
}

let deleteEmployeId=null
function showDeleteMessage(id){
    deleteEmployeId=id
    confirmationModal.style.display="flex"
}

confirmYesButton.addEventListener("click",async function(){
    confirmationModal.style.display="none"
    await deleteEmploye(deleteEmployeId)
})

confirmNoButton.addEventListener("click",function(){
    confirmationModal.style.display="none"
})

let originalUserData={}
function updateForm(id, name, age, designation) {
    document.getElementById("employee-id").value = id;
    document.getElementById("name").value = name;
    document.getElementById("age").value = age;
    document.getElementById("designation").value = designation;

    originalUserData={id,name,age,designation}
    modal.style.display="flex"
    checkChanges()
}

const formInput=document.querySelectorAll("#employee-form input");
formInput.forEach(input=>{
    input.addEventListener("input",checkChanges)
})

function checkChanges(){
    const id=document.getElementById("employee-id").value
    const name=document.getElementById("name").value
    const age=document.getElementById("age").value
    const designation=document.getElementById("designation").value
    const isChanged=name !==originalUserData.name || age !==originalUserData.age || designation !==originalUserData.designation;
    if(!isChanged){
        submitButton.style.display="none"
    }
    else{
        submitButton.style.display="block"
    }
}

async function addEmployee(details) {
    try {
        const response = await fetch(employeeApi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(details),
        });
        if (!response.ok) {
            throw new Error("Sorry...There is an error Occured");
        }
        await fetchApi();
        displaySnackbar("Employee added successfully", true);
    } catch (err) {
        displaySnackbar(err.message, false);
    }
}

async function editEmployee(id, newData) {
    try {
        const response = await fetch(`${employeeApi}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newData),
        });
        if (!response.ok) {
            throw new Error("Sorry...There is an error Occured");
        } else {
            await fetchApi();
            displaySnackbar("Details Edited Successfully", true);
            document.getElementById("employee-id").value = "";
        }
    } catch (err) {
        displaySnackbar(err.message, false);
    }
}

async function deleteEmploye(id) {
    try {
        const response = await fetch(`${employeeApi}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Sorry...There is an error Occured");
        }
        displaySnackbar("Data deleted Successfully", true);

        await fetchApi();
    } catch (err) {
        displaySnackbar(err.message, false);
    }
}
fetchApi();