"use strict";
class taskList {
    uID;
    title;
    filePath;
    selected = false;
    constructor(title, filePath) {
        this.uID = Date.now();
        this.title = title;
        this.filePath = filePath;
        console.log('Task List Identified: ${this.title}, File Path: ${this.filePath}, Selected: ${this.selected}');
    }
    toJSON() {
        return {
            uID: this.uID,
            title: this.title,
            filePath: this.filePath,
        };
    }
    createListElement() {
        const listDiv = document.createElement('div');
        listDiv.id = 'task-${this.uID}';
        const button = document.createElement("button");
        Object.assign(button, {
            id: 'button-${this.title}',
            className: "list-button",
            onclick: () => {
                this.renderList();
                console.log('List Rendered: ${this.title}');
            }
        });
        listDiv.appendChild(button);
        document.getElementById("quick-selector-container")?.appendChild(listDiv);
        return listDiv;
    }
    renderList() {
        const file = this.filePath;
        if (!file) {
            console.log("No file data detected");
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
                const importedTask = new task, { taskData, title, taskData, description, taskData, done, taskData, indents };
            });
            allTasks.push(importedTask);
            importedTask.createTaskElement();
        });
    }
    ;
}
//# sourceMappingURL=selector.js.map