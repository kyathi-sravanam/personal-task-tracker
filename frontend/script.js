const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

const emptyState = document.getElementById("emptyState");
const taskBadge = document.getElementById("taskBadge");

const API_URL = "http://localhost:5000/api/tasks";


// ADD TASK BUTTON

addTaskBtn.addEventListener("click", addTask);


// ENTER KEY

taskInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        addTask();
    }

});


// LOAD TASKS

loadTasks();


async function loadTasks() {

    try {

        const response = await fetch(API_URL);

        const tasks = await response.json();

        console.log("Tasks received:", tasks);

        displayTasks(tasks);

    } catch (error) {

        console.error(
            "Loading tasks failed:",
            error
        );

    }

}


// ADD TASK

async function addTask() {

    const taskText = taskInput.value.trim();


    if (taskText === "") {

        alert("Please enter a task");

        return;

    }


    try {

        console.log(
            "Sending task:",
            taskText
        );


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


        console.log(
            "Server response:",
            result
        );


        if (!response.ok) {

            alert(result.message);

            return;

        }


        taskInput.value = "";


        await loadTasks();

    } catch (error) {

        console.error(
            "Adding task failed:",
            error
        );

    }

}


// DISPLAY TASKS

function displayTasks(tasks) {

    taskList.innerHTML = "";


    taskBadge.textContent = tasks.length;


    if (tasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    tasks.forEach((task) => {

        const li = document.createElement("li");


        li.textContent = task.text;


        if (task.completed) {

            li.classList.add("completed");

        }


        li.addEventListener("click", () => {

            updateTask(
                task.id,
                !task.completed
            );

        });


        taskList.appendChild(li);

    });


    updateTaskCount(tasks);

}


// UPDATE TASK

async function updateTask(id, completed) {

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    completed: completed
                })

            }
        );


        const result = await response.json();


        console.log(
            "Update response:",
            result
        );


        await loadTasks();

    } catch (error) {

        console.error(
            "Updating task failed:",
            error
        );

    }

}


// UPDATE TASK COUNT

function updateTaskCount(tasks) {

    const remainingTasks = tasks.filter(
        (task) => !task.completed
    ).length;


    if (remainingTasks === 1) {

        taskCount.textContent =
            "1 task remaining";

    } else {

        taskCount.textContent =
            `${remainingTasks} tasks remaining`;

    }

}