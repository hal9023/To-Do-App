console.log("Todo List App Initialized!");

let taskList = [];

function createNewTask() {
    const newTask = document.createElement("div");
    newTask.className = "task-item";
    const checkButton = document.createElement("input");
    const taskLabel = document.createElement("label");
    const deleteButton = document.createElement("button");

    Object.assign(taskLabel, {
        for: "taskName",
        innerText: document.getElementById("taskName").value
    });

    if (document.getElementById("taskName").value === "") {
        taskLabel.innerText = "New Task";
    }

    Object.assign(checkButton, {
        type: "checkbox",
        value: "Done!"
    });

    Object.assign(deleteButton, {
        innerText: "Delete"
    });
    deleteButton.addEventListener("click", () => {
        const index = Number(checkButton.dataset.index);
        deleteTask(index);
    });
    const taskName = taskLabel.innerText;
    const task = { name: taskName, completed: false };
    const taskIndex = taskList.push(task) - 1;

    checkButton.dataset.index = taskIndex;

    newTask.append(checkButton);
    newTask.append(taskLabel);
    newTask.append(deleteButton);
    document.getElementById('taskListContainer').appendChild(newTask);

    console.log("New Task Created!");
}
function deleteTask(index) {
    const taskElements = document.querySelectorAll('.task-item');
    if (index >= 0 && index < taskElements.length) {
        taskElements[index].remove();
        taskList.splice(index, 1);
        console.log(`Deleted task at index ${index}.`);
    } else {
        console.error(`Invalid index ${index}. No task deleted.`);
    }
    // Need to make it realign the index after deleting a task, otherwise the checkboxes will stop working after deleting a task that isn't the last one in the list
    taskElements.forEach((element, idx) => {
        const checkbox = element.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.dataset.index = idx;
        }
    });
}
function printTaskList() {
    console.log("Current Task List:");
    taskList.forEach((task, index) => {
        console.log(`${index + 1}. ${task.name} - ${task.completed ? "Completed" : "Not Completed"}`);
    });
}
function clearTaskElements() {
    const taskElements = document.querySelectorAll('.task-item');
    taskElements.forEach((element) => element.remove());
}

function displayTaskList(list) {
    clearTaskElements();
    taskList = list.slice();

    list.forEach((task, index) => {
        const newTask = document.createElement("div");
        newTask.className = "task-item";
        const checkButton = document.createElement("input");
        const taskLabel = document.createElement("label");
        const deleteButton = document.createElement("button");

        Object.assign(taskLabel, {
            for: "taskName",
            innerText: task.name
        });
        Object.assign(checkButton, {
            type: "checkbox",
            value: "Done!",
            checked: task.completed
        });
        Object.assign(deleteButton, {
            innerText: "Delete"
        });

        checkButton.dataset.index = index;
        deleteButton.addEventListener("click", () => {
            deleteTask(index);
        });

        newTask.append(checkButton);
        newTask.append(taskLabel);
        newTask.append(deleteButton);
        document.getElementById('taskListContainer').appendChild(newTask);
    });
}
function deleteCurrentTasks() {
    const taskElements = document.querySelectorAll('.task-item');
    taskElements.forEach((element) => element.remove());
    taskList = [];
    console.log(`Deleted ${taskElements.length} current task(s).`);
}

function exportTaskList() {
    const taskListJSON = JSON.stringify(taskList, null, 2);

    window.electronAPI.saveTaskFile(taskListJSON)
        .then((savedPath) => {
            if (savedPath) {
                console.log(`Task list successfully exported to ${savedPath}`);
            }
        })
        .catch((error) => {
            console.error("Error writing task list to file:", error);
        });
}
document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.matches("input[type=checkbox]") && target.dataset.index !== undefined) {
        const index = Number(target.dataset.index);
        if (taskList[index]) {
            taskList[index].completed = target.checked;
            console.log(`Task ${index + 1} completed: ${taskList[index].completed}`);
        }
    }
});

// Event listeners for creating new tasks, and for importing/exporting the task list

// Event listener for create button, which I have deprecated in favor of enter key
/*
document.addEventListener("DOMContentLoaded", () => {
    const newBtn = document.getElementById("newBtn");
    newBtn.addEventListener("click", createNewTask);
    const taskInput = document.getElementById("taskName"); // This doesn't work and idk why
    taskInput.value = ""; // This doesn't work and idk why
});
*/ 

document.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        createNewTask();
        const taskInput = document.getElementById("taskName");
        taskInput.value = "";
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const importBTN = document.getElementById("importTDL");
    const exportBTN = document.getElementById("exportTDL");

    importBTN.addEventListener("click", async () => {
        const fileContents = await window.electronAPI.openTaskFile();
        if (!fileContents) return;

        try {
            taskList = JSON.parse(fileContents);
            console.log("Task list imported successfully:");
            printTaskList();
        } catch (error) {
            console.error("Failed to parse task list:", error);
        }

        displayTaskList(taskList);
    });

    exportBTN.addEventListener("click", () => {
        exportTaskList();
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const clearBTN = document.getElementById("clearTDL");
    clearBTN.addEventListener("click", () => {
        deleteCurrentTasks();
        console.log("Task list cleared.");
    });
});