interface ImportedFile {
    content: string;
    filePath: string;
}
interface ImportedTask {
    uID: number;
    title: string;
    description: string;
    done: boolean;
    indents: number;
    selected: boolean;
}
    // What aspects does quick selector need?
    // -- A set of task lists
    // -- The Filepaths for these task lists
    // -- A way to render the Task lists
    // -- Each quick selector can be an array of task lists
    // -- A Task list Task List

class taskList {
    uID: number;
    title: string;
    file: ImportedFile;
    selected: boolean = false;
    
    constructor(title: string, file: ImportedFile) {
        this.uID = Date.now();
        this.title = title;
        this.file = file;

        console.log ('Task List Identified: ${this.title}, File Path: ${this.filePath}, Selected: ${this.selected}');
        
    }
   toJSON() {
        return {
            uID: this.uID,
            title: this.title,
            file: this.file,
        }
    }
    
    createListElement(): HTMLDivElement {
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
        // Will be written to load in task list
        // Can probably just reuse existing function for this
        
        const file = this.file;

        if (!file) {
            console.log("No file data detected");
            return;
        }
        const importedTasks = JSON.parse(file.content) as ImportedTask[];

            //Check Json Integrity
            importedTasks.forEach((taskData) => {
                if(!('uID' in taskData)) {
                    console.log ("Task is missing uID!");
                }
                else if (!('title' in taskData)) {
                    console.log ("Task is missing Title!");
                }
                else if (!('description' in taskData)) {
                    console.log ("Task is missing Description!");
                }
                else if (!('done' in taskData)) {
                    console.log ("Task is missing Done!");
                }
                else if (!('indents' in taskData)) {
                    console.log ("Task is missing Indents!");
                }
                else if (!('selected' in taskData)) {
                    console.log ("Task is missing Selected!");
                }
            });
            // Process Json
            importedTasks.forEach((taskData) => {
                const importedTask = new task (
                    taskData.title,
                    taskData.description,
                    taskData.done,
                    taskData.indents
                );
                allTasks.push(importedTask);
                importedTask.createTaskElement();
            });
    }
}    

document.addEventLiustener("DOMContentLoaded", () => {
    const addButton = document.getElementById("importQuickSelect") as HTMLButtonElement;
    addButton.addEventListener("click", () => {
        const importList = new taskList().   
        // Add File Dialog   
    });

});
