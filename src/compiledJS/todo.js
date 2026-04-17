"use strict";
class task {
    uID;
    title;
    description;
    done;
    indents;
    selected = false;
    constructor(title, description, done, indents) {
        this.uID = Date.now();
        this.title = title;
        this.description = description;
        this.done = done;
        this.indents = indents;
        console.log(`Task created: ${this.title}, Description: ${this.description}, Done: ${this.done}, Indents: ${this.indents}`);
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
    }
    applyIndentation(HTMLDivElement) {
        HTMLDivElement.style.marginLeft = `${this.indents * 20}px`;
    }
}
const allTasks = [];
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
//# sourceMappingURL=todo.js.map