const apiUrl = "https://672de19efd89797156441aa3.mockapi.io/crud/api/v1/student";

// Display message to the user
function showMessage(message, type) {
  const messageElement = document.getElementById("message");
  messageElement.textContent = message;
  messageElement.className = `message ${type}`;
  setTimeout(() => {
    messageElement.textContent = "";
    messageElement.className = "message";
  }, 3000);
}

// Function to get and display students
function getStudents() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const studentsContainer = document.getElementById("studentsContainer");
      studentsContainer.innerHTML = ""; // Clear previous students

      data.forEach(student => {
        displaySingleStudent(student);
      });
    })
    .catch(error => showMessage("Error fetching students", "error"));
}

// Function to create a new student
function createStudent() {
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;

  if (name && age) {
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        name: name,
        age: parseInt(age),
      }),
    })
    .then(response => response.json())
    .then(data => {
      showMessage("Student added successfully!", "success");
      displaySingleStudent(data); // Display the new student immediately
    })
    .catch(error => showMessage("Error adding student", "error"));
  } else {
    showMessage("Name and age cannot be empty.", "error");
  }
}

// Function to display a single student (for new students or updates)
function displaySingleStudent(student) {
  const studentsContainer = document.getElementById("studentsContainer");

  const studentElement = document.createElement("div");
  studentElement.classList.add("post");
  studentElement.id = `student-${student.id}`;
  studentElement.innerHTML = `
    <h4>${student.name}</h4>
    <p>Age: ${student.age}</p>
    <div class="btn-group">
      <button onclick="updateStudent(${student.id})">Edit</button>
      <button onclick="deleteStudent(${student.id})">Delete</button>
    </div>
  `;

  studentsContainer.appendChild(studentElement);
}

// Function to update a student
function updateStudent(id) {
  const name = prompt("Enter new name:");
  const age = prompt("Enter new age:");

  if (name && age) {
    fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        name: name,
        age: parseInt(age),
      }),
    })
    .then(response => response.json())
    .then(() => {
      showMessage("Student updated successfully!", "success");
      document.querySelector(`#student-${id} h4`).textContent = name;
      document.querySelector(`#student-${id} p`).textContent = `Age: ${age}`;
    })
    .catch(error => showMessage("Error updating student", "error"));
  }
}

// Function to delete a student
function deleteStudent(id) {
  if (confirm("Are you sure you want to delete this student?")) {
    fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    })
    .then(() => {
      showMessage("Student deleted successfully!", "success");
      document.getElementById(`student-${id}`).remove();
    })
    .catch(error => showMessage("Error deleting student", "error"));
  }
}
