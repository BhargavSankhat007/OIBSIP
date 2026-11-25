

let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editIndex = null;

function showTasks(filter = "all") {
taskList.innerHTML = "";

tasks.forEach((task, index) => {
    if (filter === "completed" && !task.completed) return;
    if (filter === "pending" && task.completed) return;

    let li = document.createElement("li");

    let span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) {
        span.style.textDecoration = "line-through";
    }

    let buttons = document.createElement("div");

    buttons.innerHTML = `
        <button onclick="toggleTask(${index})">✓</button>
        <button onclick="editTask(${index})">Edit</button>
        <button onclick="deleteTask(${index})">X</button>
    `;

    li.append(span, buttons);
    taskList.appendChild(li);
});

}

function addTask() {
let text = taskInput.value.trim();

if (text === "") {
    alert("Please enter a task!");
    return;
}

if (editIndex !== null) {
    tasks[editIndex].text = text;
    editIndex = null;
    addBtn.textContent = "Add";
} else {
    tasks.push({
        text: text,
        completed: false
    });
}

taskInput.value = "";
saveTasks();
showTasks();

}

function editTask(index) {
taskInput.value = tasks[index].text;
editIndex = index;
addBtn.textContent = "Update";
taskInput.focus();
}

function toggleTask(index) {
tasks[index].completed = !tasks[index].completed;
saveTasks();
showTasks();
}

function deleteTask(index) {
tasks.splice(index, 1);

if (editIndex === index) {
    editIndex = null;
    taskInput.value = "";
    addBtn.textContent = "Add";
} else if (editIndex !== null && index < editIndex) {
    editIndex--;
}

saveTasks();
showTasks();

}

function saveTasks() {
localStorage.setItem("tasks", JSON.stringify(tasks));
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(event) {
if (event.key === "Enter") {
addTask();
}
});

document.querySelectorAll(".filters button").forEach(button => {
button.addEventListener("click", function() {
showTasks(this.dataset.filter);
});
});

showTasks();