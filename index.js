
var form;
let allUsers = []
document.addEventListener('DOMContentLoaded', () => {
    console.log('hello after Dom')
    const ageInput = document.getElementById('age');
    const restrictToInteger = function(field) {
        field.addEventListener('input', function() {
            const value = this.value.trim();
            const regex = /^\d*$/;
            if (!regex.test(value)) {
                this.value = value.replace(/\D/g, '');
            }
        });
    };
    restrictToInteger(ageInput);
    fetchData()
    form = document.getElementById('myForm')
    form.addEventListener('submit', (event) => {
        event.preventDefault();
    })
})

const apiUrl = 'http://192.168.1.12:3400/api/userDocuments';


async function fetchData() {
    try {
        const data = await fetch(apiUrl); 
        const response = await data.json();
        console.log('Data:', [...response]);
        allUsers = response;
        myCreateFunction(response);
    }
    catch (e) {
        console.log('error while fetching -- ', e)
    }

    }
    

    function submitForm() {
    const name = document.getElementById('name').value;
    const gender = document.getElementById('gender').value;
    const age = document.getElementById('age').value;
    console.log(name, gender, age)
    var table = document.getElementById("myTable");
    if(!myUpdateFlag) {
        const options =  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name": name, 
                "age": age, 
                "gender": gender, 
            })
        }
        fetch(apiUrl, options).then(res => {
           const data = res.json().then(response => {
                console.log(response)
                addOneRow(id, name, age, gender)
            })
        })
        document.getElementById('myForm').reset();        
    }
    else {
        const url = `${apiUrl}/${myUpdateFlag}`
        const options = {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "name": name, 
                "age": age, 
                "gender": gender, 
            })
        }
        fetch(url, options).then(res => {
            res.json().then(response => {
                console.log(response)
                window.location.reload()
            })
          })
        console.log('UPDATE LOGIC RUNNING')
        myUpdateFlag = 0;
        document.getElementById('myForm').reset();
        document.getElementById('submit-btn').innerText = 'Submit' 
    }
};



function myCreateFunction(data) {
    let students = data;
    let table = document.getElementById("myTable");
    console.log(students.length)

    for (let index = 0; index < students.length; index++) {
        console.log('INDEX RUNNING ')
        // students.length = table.rows.length;
        const student  = students[index];
        const row = table.insertRow(index + 1) 
        const tabelRow = {
            id: row.insertCell(0),
            name: row.insertCell(1),
            gender: row.insertCell(2),
            age: row.insertCell(3),
            action: row.insertCell(4)
        }
        tabelRow.id.innerHTML = student.id;
        tabelRow.name.innerHTML = student.name;
        tabelRow.gender.innerHTML = student.gender;
        tabelRow.age.innerHTML = student.age;                                                       
        tabelRow.action.innerHTML = `
        <div>
        <button onclick="editRow('${student.id}', '${student.name}', '${student.age}', '${student.gender}')">EDIT</button>
        <button onclick="deleteRow('${student.id}')">DELETE</button>
        </div>
        `
    }
}

function updateToServer(params) {
    console.log(params)
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    }
    fetch(apiUrl, options).then(res => {
        res.json().then(response => {
            console.log(response)
        })
    })
}

function addOneRow(id, name, age, gender) {
    const table = document.getElementById('myTable')
    const row = table.rows.length('length');
    id = myUpdateFlag;
    row.insertCell(0).textContent = id
    row.insertCell(1).textContent = name
    row.insertCell(2).textContent = age
    row.insertCell(3).textContent = gender
    row.insertCell(4).innerHTML = `
    <div>
    <button onclick="editRow('${id}', '${name}', '${age}', '${gender}')">EDIT</button>
    <button onclick="deleteRow('${id}')">DELETE</button>
    </div>`
}

function validateForm() {
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const gender = document.getElementById('gender').value;
    const age = document.getElementById('age').value;
    if ( name === "" || gender === "" || age === "") {
        alert("Please fill in all fields");
        return false;
    }
    validateName(id, name, gender, age);
}

function validateName(id, name, gender, age) {

    const nameInput = name.trim();
    const containsDigit = /\d/.test(nameInput);
    if (containsDigit) {
        alert("Name field should not contain digits. Please refill the field.");
        name = '';
    } else {
        submitForm()
    }
}


let myUpdateFlag = 0
function editRow(id, name, age, gender) {
    console.log(id)
    document.getElementById('id').value = id;
    document.getElementById('name').value = name;
    document.getElementById('gender').value = gender;
    document.getElementById('age').value = age;
    document.getElementById('submit-btn').innerText = 'UPDATE' 
    myUpdateFlag = id;
};

async function deleteRow(id) {
    document.getElementById('id').value = id;
    console.log(id)
    if(confirm('do u want to delete this record'))
    {
        //const url = await `${apiUrl}/${id}`
        //const options = {
            try{
                const response = await fetch(`${apiUrl}/${id}`, {
                    method: 'DELETE',
                });
                window.location.reload()
        }
    
        catch (error) {
          console.error('Error:', error);
        }
    }
}
function addStyle() {
    var table = document.getElementById("myTable");
    const body = document.getElementsByTagName("body")
    console.log(body)
    body[0].style.backgroundColor = "orange";
    body[0].style.margin = "auto";
    body[0].style.position = "center";
    body[0].style.height = "100%";
    body[0].style.width = "100%";
    body[0].style.length = "100%";
    
    const tbody = document.getElementsByTagName("tbody");
    for( var i = 0; i<tbody.length; i++){
        tbody[i].style.color = "black";
        tbody[i].style.backgroundColor = "white";
        tbody[i].style.fontSize = "22";
        tbody[i].style.fontWeight = "bold";
    }
    const thead = document.getElementsByTagName("thead");
    for( var j = 0; i<thead.length; j++){
        thead[j].style.color = "white";
        thead[j].style.backgroundColor = "black";
        thead[j].style.fontSize = "30";
        thead[j].style.fontWeight = "bold";
    }
    return thead;
}   



console.log('JUST A MESSAGE TO SHOW CHANGE IN FILE -- SHOW IN GITHUB')


