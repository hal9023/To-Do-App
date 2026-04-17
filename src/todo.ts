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

function exportTDL (masterList: task[]) {
    
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