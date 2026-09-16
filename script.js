const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

let tasks = [];

addTaskBtn.addEventListener("click", addTask);

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    tasks.push({
        text: taskText,
        completed: false
    });

    taskInput.value = "";

    displayTasks();
}

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        li.textContent = task.text;

        if (task.completed) {
            li.classList.add("completed");
        }

        li.addEventListener("click", function () {
            tasks[index].completed = !tasks[index].completed;
            displayTasks();
        });

        taskList.appendChild(li);
    });

    updateTaskCount();
}

function updateTaskCount() {
    const remainingTasks = tasks.filter(task => !task.completed).length;

    taskCount.textContent = `${remainingTasks} tasks remaining`;
}