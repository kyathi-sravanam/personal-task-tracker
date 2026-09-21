const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");

const taskList = document.getElementById("taskList");
const taskBadge = document.getElementById("taskBadge");
const taskCount = document.getElementById("taskCount");

const searchInput = document.getElementById("searchInput");

const emptyState = document.getElementById("emptyState");

const loadingState = document.getElementById("loadingState");

const errorState = document.getElementById("errorState");
const errorMessage = document.getElementById("errorMessage");
const retryBtn = document.getElementById("retryBtn");

const progressFill =
    document.getElementById("progressFill");

const progressPercentage =
    document.getElementById("progressPercentage");

const progressText =
    document.getElementById("progressText");

const filterButtons =
    document.querySelectorAll(".filter-btn");


const API_URL =
    "http://localhost:5000/api/tasks";


let tasks = [];

let currentFilter = "all";


// ========================================
// INITIAL LOAD
// ========================================

loadTasks();


// ========================================
// ADD TASK BUTTON
// ========================================

addTaskBtn.addEventListener(
    "click",
    addTask
);


// ========================================
// ENTER KEY
// ========================================

taskInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener(
    "input",
    renderTasks
);


// ========================================
// FILTER BUTTONS
// ========================================

filterButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    (btn) => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderTasks();

            }
        );

    }
);


// ========================================
// RETRY BUTTON
// ========================================

retryBtn.addEventListener(
    "click",
    loadTasks
);


// ========================================
// LOAD TASKS
// ========================================

async function loadTasks() {

    showLoading();

    hideError();


    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Server returned an error."
            );

        }


        tasks =
            await response.json();


        console.log(
            "Tasks received:",
            tasks
        );


        renderTasks();

        updateProgress();

        updateTaskCount();


        hideLoading();


    } catch (error) {

        console.error(
            "Loading tasks failed:",
            error
        );


        hideLoading();

        showError(
            "Could not connect to the backend. Make sure your server is running on port 5000."
        );

    }

}


// ========================================
// ADD TASK
// ========================================

async function addTask() {

    const text =
        taskInput.value.trim();


    if (!text) {

        alert(
            "Please enter a task."
        );

        return;

    }


    const priority =
        priorityInput.value;


    const dueDate =
        dueDateInput.value;


    addTaskBtn.disabled = true;

    addTaskBtn.innerHTML =
        "Adding...";


    try {

        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        text: text,

                        priority:
                            priority,

                        due_date:
                            dueDate || null

                    })

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to add task."
            );

        }


        console.log(
            "Task added:",
            result
        );


        taskInput.value = "";

        priorityInput.value =
            "medium";

        dueDateInput.value = "";


        await loadTasks();


    } catch (error) {

        console.error(
            "Adding task failed:",
            error
        );


        alert(
            error.message
        );

    } finally {

        addTaskBtn.disabled =
            false;

        addTaskBtn.innerHTML =
            "<span>+</span> Add Task";

    }

}


// ========================================
// RENDER TASKS
// ========================================

function renderTasks() {

    taskList.innerHTML = "";


    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    let filteredTasks =
        [...tasks];


    // SEARCH

    if (searchText) {

        filteredTasks =
            filteredTasks.filter(
                (task) =>
                    task.text
                        .toLowerCase()
                        .includes(searchText)
            );

    }


    // FILTER

    if (currentFilter === "active") {

        filteredTasks =
            filteredTasks.filter(
                (task) =>
                    !task.completed
            );

    }


    if (currentFilter === "completed") {

        filteredTasks =
            filteredTasks.filter(
                (task) =>
                    task.completed
            );

    }


    // EMPTY STATE

    if (filteredTasks.length === 0) {

        emptyState.style.display =
            "block";

    } else {

        emptyState.style.display =
            "none";

    }


    // CREATE TASKS

    filteredTasks.forEach(
        (task) => {

            const taskElement =
                createTaskElement(task);


            taskList.appendChild(
                taskElement
            );

        }
    );


    // TOTAL TASK BADGE

    taskBadge.textContent =
        tasks.length;


    updateTaskCount();

    updateProgress();

}


// ========================================
// CREATE TASK ELEMENT
// ========================================

function createTaskElement(task) {

    const li =
        document.createElement("li");


    li.className =
        "task-item";


    // CHECKBOX

    const checkbox =
        document.createElement("button");


    checkbox.className =
        "task-checkbox";


    if (task.completed) {

        checkbox.classList.add(
            "completed"
        );

        checkbox.textContent =
            "✓";

    }


    checkbox.addEventListener(
        "click",
        () => {

            updateTask(
                task.id,
                {
                    completed:
                        !task.completed
                }
            );

        }
    );


    // CONTENT

    const content =
        document.createElement("div");


    content.className =
        "task-content";


    const text =
        document.createElement("div");


    text.className =
        "task-text";


    text.textContent =
        task.text;


    if (task.completed) {

        text.classList.add(
            "completed"
        );

    }


    // META

    const meta =
        document.createElement("div");


    meta.className =
        "task-meta";


    // PRIORITY

    const priority =
        document.createElement("span");


    priority.className =
        `priority priority-${task.priority || "medium"}`;


    priority.textContent =
        task.priority || "medium";


    meta.appendChild(
        priority
    );


    // DUE DATE

    if (task.due_date) {

        const dueDate =
            document.createElement("span");


        dueDate.className =
            "due-date";


        dueDate.textContent =
            `📅 ${formatDate(task.due_date)}`;


        meta.appendChild(
            dueDate
        );

    }


    content.appendChild(
        text
    );


    content.appendChild(
        meta
    );


    // ACTIONS

    const actions =
        document.createElement("div");


    actions.className =
        "task-actions";


    // EDIT BUTTON

    const editButton =
        document.createElement("button");


    editButton.className =
        "action-btn";


    editButton.textContent =
        "✏️";


    editButton.title =
        "Edit task";


    editButton.addEventListener(
        "click",
        () => {

            editTask(
                task,
                content
            );

        }
    );


    // DELETE BUTTON

    const deleteButton =
        document.createElement("button");


    deleteButton.className =
        "action-btn";


    deleteButton.textContent =
        "🗑️";


    deleteButton.title =
        "Delete task";


    deleteButton.addEventListener(
        "click",
        () => {

            deleteTask(
                task.id
            );

        }
    );


    actions.appendChild(
        editButton
    );


    actions.appendChild(
        deleteButton
    );


    li.appendChild(
        checkbox
    );


    li.appendChild(
        content
    );


    li.appendChild(
        actions
    );


    return li;

}


// ========================================
// EDIT TASK
// ========================================

function editTask(
    task,
    content
) {

    content.innerHTML = "";


    const input =
        document.createElement("input");


    input.className =
        "edit-input";


    input.value =
        task.text;


    content.appendChild(
        input
    );


    input.focus();


    input.select();


    input.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter"
            ) {

                saveEditedTask(
                    task.id,
                    input.value
                );

            }


            if (
                event.key === "Escape"
            ) {

                renderTasks();

            }

        }
    );


    input.addEventListener(
        "blur",
        () => {

            if (
                input.value.trim() !==
                task.text
            ) {

                saveEditedTask(
                    task.id,
                    input.value
                );

            } else {

                renderTasks();

            }

        }
    );

}


// ========================================
// SAVE EDITED TASK
// ========================================

async function saveEditedTask(
    id,
    text
) {

    text =
        text.trim();


    if (!text) {

        alert(
            "Task cannot be empty."
        );

        renderTasks();

        return;

    }


    await updateTask(
        id,
        {
            text: text
        }
    );

}


// ========================================
// UPDATE TASK
// ========================================

async function updateTask(
    id,
    updateData
) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            updateData
                        )

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to update task."
            );

        }


        await loadTasks();


    } catch (error) {

        console.error(
            "Update failed:",
            error
        );


        alert(
            error.message
        );

    }

}


// ========================================
// DELETE TASK
// ========================================

async function deleteTask(
    id
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to delete task."
            );

        }


        await loadTasks();


    } catch (error) {

        console.error(
            "Delete failed:",
            error
        );


        alert(
            error.message
        );

    }

}


// ========================================
// UPDATE TASK COUNT
// ========================================

function updateTaskCount() {

    const remaining =
        tasks.filter(
            (task) =>
                !task.completed
        ).length;


    if (remaining === 1) {

        taskCount.textContent =
            "1 task remaining";

    } else {

        taskCount.textContent =
            `${remaining} tasks remaining`;

    }

}


// ========================================
// UPDATE PROGRESS
// ========================================

function updateProgress() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            (task) =>
                task.completed
        ).length;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) *
                100
            );

    }


    progressFill.style.width =
        `${percentage}%`;


    progressPercentage.textContent =
        `${percentage}%`;


    progressText.textContent =
        `${completed} of ${total} tasks completed`;

}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(dateString) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


// ========================================
// LOADING
// ========================================

function showLoading() {

    loadingState.style.display =
        "block";

}


function hideLoading() {

    loadingState.style.display =
        "none";

}


// ========================================
// ERROR
// ========================================

function showError(message) {

    errorMessage.textContent =
        message;

    errorState.style.display =
        "block";

}


function hideError() {

    errorState.style.display =
        "none";

}