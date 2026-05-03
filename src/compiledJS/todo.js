"use strict";
class task {
    uID;
    title;
    description;
    done;
    indents;
    selected = false;
    deleted = false;
    constructor(title, description, done, indents) {
        this.uID = Date.now();
        this.title = title;
        this.description = description;
        this.done = done;
        this.indents = indents;
        console.log(`Task created: ${this.title}, Description: ${this.description}, Done: ${this.done}, Indents: ${this.indents}`);
    }
    toJSON() {
        return {
            uID: this.uID,
            title: this.title,
            description: this.description,
            done: this.done,
            indents: this.indents
        };
    }
    createTaskElement() {
        const taskDiv = document.createElement('div');
        taskDiv.id = `task-${this.uID}`;
        const checkButton = document.createElement("input");
        const taskLabel = document.createElement("label");
        const deleteButton = document.createElement("button");
        Object.assign(checkButton, {
            id: `check-${this.title}`,
            type: "checkbox",
            checked: this.done,
            className: "check-button",
            onclick: () => {
                this.done = checkButton.checked;
                taskLabel.style.textDecoration = this.done ? "line-through" : "none";
                console.log("Task status changed:", this.done);
            }
        });
        Object.assign(taskLabel, {
            id: `label-${this.title}`,
            textContent: this.title,
            className: "task-label",
        });
        Object.assign(deleteButton, {
            id: `delete-${this.title}`,
            textContent: "Delete",
            className: "delete-button",
            onclick: () => {
                this.deleteTask();
                console.log(`Task deleted: ${this.title}`);
            }
        });
        taskDiv.appendChild(checkButton);
        taskDiv.appendChild(taskLabel);
        taskDiv.appendChild(deleteButton);
        document.getElementById("taskContainer")?.appendChild(taskDiv);
        return taskDiv;
    }
    deleteTask() {
        document.getElementById(`task-${this.uID}`)?.remove();
        this.deleted = true;
    }
    applyIndentation(HTMLDivElement) {
        HTMLDivElement.style.marginLeft = `${this.indents * 20}px`;
    }
}
let allTasks = [];
function exportTDL(masterList) {
    const jsonData = JSON.stringify(masterList.map(task => task.toJSON()), null, 2);
    console.log(jsonData);
    window.electronAPI.saveTaskFile(jsonData)
        .then((savedPath) => {
        console.log("File saved successfully.");
    })
        .catch((error) => {
        console.error("Error saving file:", error);
    });
}
async function importTDL() {
    const file = await window.electronAPI.openTaskFile();
    if (!file) {
        console.log("No file data selected");
        return;
    }
    file.forEach((files) => {
        const importedTasks = JSON.parse(files.content);
        importedTasks.forEach((taskData) => {
            if (!('uID' in taskData)) {
                console.log("Task is missing uID!");
            }
            else if (!('title' in taskData)) {
                console.log("Task is missing Title!");
            }
            else if (!('description' in taskData)) {
                console.log("Task is missing Description!");
            }
            else if (!('done' in taskData)) {
                console.log("Task is missing Done!");
            }
            else if (!('indents' in taskData)) {
                console.log("Task is missing Indents!");
            }
            else if (!('selected' in taskData)) {
                console.log("Task is missing Selected!");
            }
        });
        importedTasks.forEach((taskData) => {
            const importedTask = new task(taskData.title, taskData.description, taskData.done, taskData.indents);
            allTasks.push(importedTask);
            importedTask.createTaskElement();
        });
    });
}
function updateMasterList(oldMaster) {
    const newList = [];
    oldMaster.forEach((task) => {
        if (!task.deleted) {
            newList.push(task);
        }
    });
    return newList;
}
function clearTDL(masterList) {
    masterList.forEach((task) => {
        task.deleteTask();
    });
}
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const titleInput = document.getElementById("taskName");
        if (!titleInput.value)
            return;
        const newTask = new task(titleInput.value, "", false, 0);
        allTasks.push(newTask);
        newTask.createTaskElement();
        titleInput.value = "";
        console.log("Current Tasks:", allTasks);
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const exportButton = document.getElementById("exportTDL");
    const importButton = document.getElementById("importTDL");
    const clearButton = document.getElementById("clearTDL");
    exportButton.addEventListener("click", () => {
        allTasks = updateMasterList(allTasks);
        exportTDL(allTasks);
    });
    importButton.addEventListener("click", () => {
        allTasks = updateMasterList(allTasks);
        importTDL();
    });
    clearButton.addEventListener("click", () => {
        allTasks = updateMasterList(allTasks);
        clearTDL(allTasks);
    });
});
//# sourceMappingURL=todo.js.map