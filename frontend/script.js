const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

const API_URL = "http://localhost:5000/api/tasks";

addTaskBtn.addEventListener("click", addTask);

loadTasks();

async function loadTasks() {
    try {
        const response = await fetch(API_URL);

        const tasks = await response.json();

        console.log("Tasks received:", tasks);

        displayTasks(tasks);
    } catch (error) {
        console.error("Loading tasks failed:", error);
    }
}

async function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    try {
        console.log("Sending task:", taskText);

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: taskText
            })
        });

        const result = await response.json();

        console.log("Server response:", result);

        if (!response.ok) {
            alert(result.message);
            return;
        }

        taskInput.value = "";

        await loadTasks();
    } catch (error) {
        console.error("Adding task failed:", error);
    }
}

function displayTasks(tasks) {
    taskList.innerHTML = "";

    tasks.forEach((task) => {
        const li = document.createElement("li");

        li.textContent = task.text;

        if (task.completed) {
            li.classList.add("completed");
        }

        li.addEventListener("click", () => {
            updateTask(task.id, !task.completed);
        });

        taskList.appendChild(li);
    });

    updateTaskCount(tasks);
}

async function updateTask(id, completed) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: completed
            })
        });

        const result = await response.json();

        console.log("Update response:", result);

        await loadTasks();
    } catch (error) {
        console.error("Updating task failed:", error);
    }
}

function updateTaskCount(tasks) {
    const remainingTasks = tasks.filter(
        task => !task.completed
    ).length;

    taskCount.textContent =
        `${remainingTasks} tasks remaining`;
}