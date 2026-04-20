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

class task {
    // Basic attributes of the task
    uID: number; // Unique identifier for the task, can be used for selection and other operations
    title: string;
    description: string;
    done: boolean;
    indents: number;
    selected: boolean = false;
    
    // Constructor method for class task
    constructor(title: string, description: string, done: boolean, indents: number) {
        this.uID = Date.now(); // Assign a unique ID based on the current timestamp
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
        }
    }
    createTaskElement(): HTMLDivElement {
        // HTML elements of the task
        
        const taskDiv = document.createElement('div');
        taskDiv.id = `task-${this.uID}`;

        const checkButton = document.createElement("input");
        const taskLabel = document.createElement("label");
        const deleteButton = document.createElement("button");

        Object.assign(checkButton, {
            id: `check-${this.title}`,
            type: "checkbox",
            checked: this.done,
            className: "check-button", // Add class for styling
            onclick: () => {                this.done = checkButton.checked;
                taskLabel.style.textDecoration = this.done ? "line-through" : "none";
                console.log("Task status changed:", this.done);
            }
        })
        Object.assign(taskLabel, {
            id: `label-${this.title}`,
            textContent: this.title,
            className: "task-label", // Add class for styling 
        })
        Object.assign(deleteButton, {
            id: `delete-${this.title}`,
            textContent: "Delete",
            className: "delete-button", // Add class for styling
            onclick: () => {
                this.deleteTask();
                console.log(`Task deleted: ${this.title}`);
            }
        })
        
        taskDiv.appendChild(checkButton);
        taskDiv.appendChild(taskLabel);
        taskDiv.appendChild(deleteButton);

        document.getElementById("taskContainer")?.appendChild(taskDiv);

        return taskDiv;
    }
    deleteTask() {
        document.getElementById(`task-${this.uID}`)?.remove();

    }
    applyIndentation(HTMLDivElement: HTMLDivElement) {
        HTMLDivElement.style.marginLeft = `${this.indents * 20}px`;
    }
}

const allTasks: task[] = []; // Array to hold all tasks.

function exportTDL(masterList: task[]) {
    // Iterate over allTasks, stringify each task, and write to a JSON file
    const jsonData = JSON.stringify(masterList.map(task => task.toJSON()), null, 2);
    console.log(jsonData);

    // Log to file
    window.electronAPI.saveTaskFile(jsonData)
        .then((savedPath: void) => {
            console.log("File saved successfully.");
        })
        .catch((error: any) => {
            console.error("Error saving file:", error);
        })
}

async function importTDL() {
    // Grab file contents => parse JSON into task objects => update master list of Tasks to include those tasks objects
    // Display master list of tasks as to-do list 

    const file = await window.electronAPI.openTaskFile(); 

    if (!file) {
        console.log("No file data selected");
        return;
    }

    file.forEach((files: ImportedFile) => {
        const importedTasks = JSON.parse(files.content) as ImportedTask[];
        
        // Check JSON integrity
        importedTasks.forEach((taskData) => {
            if (!('uID' in taskData)) {
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
        // Process JSON if integrity is good
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
    }) 
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const titleInput = document.getElementById("taskName") as HTMLInputElement;
        if (!titleInput.value) return; // Prevent adding empty task

        const newTask = new task(titleInput.value, "", false, 0);
        allTasks.push(newTask);

        newTask.createTaskElement();
        titleInput.value = ""; // Clear input after adding task

        console.log("Current Tasks:", allTasks);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const exportButton = document.getElementById("exportTDL") as HTMLButtonElement;
    const importButton = document.getElementById("importTDL") as HTMLButtonElement;

    exportButton.addEventListener("click", () => {
        exportTDL(allTasks);
    });

    importButton.addEventListener("click", () => {
        importTDL();
    })
});
/*
Demonstration Button to test class functionality, will be removed once basic functionality
is achieved for the rewrite

document.addEventListener("DOMContentLoaded", () => {
    const testButton = document.getElementById("testButton") as HTMLButtonElement;
    testButton.addEventListener("click", () => {
        console.log("Test button clicked!");

        const task1 = new task("Task 1", "Description for Task 1", false, 0);

        task1.createTaskElement();
        const task1DeleteButton = document.getElementById(`delete-${task1.title}`) as HTMLButtonElement;

        console.log(task1DeleteButton);
    });
});
*/