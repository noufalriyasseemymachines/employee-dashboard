const employeeApi ="https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee";

const errorMessage = document.getElementById("error-message");
const addButton = document.getElementById("add-button");
const modal = document.getElementById("modal");
const closeButton = document.getElementById("close-modal");
const filterDropdown = document.getElementById("filter-type");
const filterInput = document.getElementById("filter-input");

addButton.addEventListener("click", function () {
    modal.style.display = "flex";
});

closeButton.addEventListener("click", function () {
    modal.style.display = "none";
});

document.getElementById("employee-form").addEventListener("submit", function (event) {
        event.preventDefault();
        const id = document.getElementById("employee-id").value;
        const name = document.getElementById("name").value;
        const age = document.getElementById("age").value;
        const designation = document.getElementById("designation").value;

        const namePattern = /^[A-Za-z\s]+$/;
        if (!namePattern.test(name)) {
            displayError("Name can only contain letters and spaces.");
            setTimeout(() => displayError(""), 1500);
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
filterDropdown.addEventListener("change",fetchApi);

async function fetchApi() {
    try {
        const response = await fetch(employeeApi);
        if (!response.ok) {
            throw new Error("Network Error");
        }
        const data = await response.json();

        const filterType = filterDropdown.value;
        const filterValue = filterInput.value.toLowerCase();
        const filteredData= ((filterType==="" && filterValue==="")||(filterType==="" && filterValue!==""))? data :
        data.filter(employe =>{
            return (filterType==="name" && employe.name.toLowerCase().includes(filterValue))||
            (filterType==="designation" && employe.designation.toLowerCase().includes(filterValue))
        })
        if(filteredData.length>0){
        displayEmployee(filteredData)
        displayError("")
        }
        else{
        displayError("Search result Not Found")
        displayEmployee(filteredData)
        }
    }
    catch (error) {
        displayError(error.message);
        setTimeout(() => {
            displayError(""), 1500;
        });
    }
}

function displayError(error, isSuccess = false) {
    errorMessage.textContent = error;
    if (isSuccess) {
        errorMessage.style.color = "green";
    } else {
        errorMessage.style.color = "red";
    }
}

function displayEmployee(employeData) {
    const employeeList = document.getElementById("employee-list");
    employeeList.innerHTML = "";
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
                <button class="delete-btn" onclick="deleteEmploye('${employ.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    employeeList.appendChild(table);
}

function updateForm(id, name, age, designation) {
    document.getElementById("employee-id").value = id;
    document.getElementById("name").value = name;
    document.getElementById("age").value = age;
    document.getElementById("designation").value = designation;
    modal.style.display = "flex";
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
        displayError("Employee added succesfully", true);
        setTimeout(() => displayError(""), 1500);
    } catch (err) {
        displayError(err.message);
        setTimeout(() => displayError(""), 1500);
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
            displayError("Details Edited Succesfully", true);
            setTimeout(() => displayError(""), 1500);
            document.getElementById("employee-id").value = "";
        }
    } catch (err) {
        displayError(err.message);
        setTimeout(() => displayError(""), 1500);
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
        displayError("Data deleted Succesfully",true)
        setTimeout(()=>displayError(""),1500)
        await fetchApi();
    } catch (err) {
        displayError(err.message);
        setTimeout(() => displayError(""), 1500);
    }
}
fetchApi();
