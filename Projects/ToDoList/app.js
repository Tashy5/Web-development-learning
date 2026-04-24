let tasks = [];
let currentFilter = "all";

const input = document.getElementById("taskinput")
const addBtn = document.getElementById("addtaskbtn")
const list = document.getElementById("tasklist")
const deleteAllBtn = document.getElementById("deleteAll");

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addBtn.click();
        }
    });

    document.getElementById("showAll").addEventListener("click", function () {
        currentFilter = "all";
        renderTasks();

    });
    document.getElementById("showActive").addEventListener("click", function () {
        currentFilter = "active";
        renderTasks();

    });
    document.getElementById("showCompleted").addEventListener("click", function () {
        currentFilter = "completed";
        renderTasks();

    });

const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
}

addBtn.addEventListener("click", function () {
    const tasktext = input.value;

    const task = {
        text: tasktext,
        completed: false
    };

    tasks.push(task);
    saveTasks();

    input.value = "";

    renderTasks();

});

deleteAllBtn.addEventListener("click", function() {
    tasks = [];

    saveTasks();
    renderTasks();
    
});

function renderTasks() {
    list.innerHTML = "";

    tasks.forEach((task,index) => {

        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        const span = document.createElement("span");
        span.textContent = task.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";

        if (currentFilter === "active" && task.completed) return;
        if (currentFilter === "completed" && !task.completed) return;

        if (task.completed) {
            span.style.textDecoration = "line-through";
        }

        checkbox.addEventListener("change", function () {
        toggleTask(index);
        });

        deleteBtn.addEventListener("click", function () {
            deleteTask(index);
        });
    
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        list.appendChild(li);


    });
}


function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}


function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
