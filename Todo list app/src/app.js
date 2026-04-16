console.log("test pleak");

let taskList = [];

function createNewTask() {
    const newTask = document.createElement("div");
    const checkButton = document.createElement("input");
    const taskLabel = document.createElement("label");
    Object.assign(taskLabel, {
        for: "taskName",
        innerText: document.getElementById("taskName").value
    });

    if (document.getElementById("taskName").value === "") {
        taskLabel.innerText = "New Task";
    }

    Object.assign(checkButton, {
        type: "checkbox",
        id: "checkBox",
        name: "checkBox",
        value: "Done!"
    });

    newTask.append(checkButton);
    newTask.append(taskLabel);
    document.body.appendChild(newTask);

    const taskName = taskLabel.innerText;
    taskList.push({ name: taskName, completed: false });
    console.log("New Task Created!");
}
function printTaskList() {
    console.log("Current Task List:");
    taskList.forEach((task, index) => {
        console.log(taskList[index].value);
        console.log(`${index + 1}. ${task.name} - ${task.completed ? "Completed" : "Not Completed"}`);
    });
}
document.addEventListener("DOMContentLoaded", () => {
    const newBtn = document.getElementById("newBtn");
    newBtn.addEventListener("click", createNewTask);
    const taskInput = document.getElementById("taskName"); // This doesn't work and idk why
    taskInput.value = ""; // This doesn't work and idk why
});
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

    importBTN.addEventListener("click", () => {
        // Import functionality would go here
        console.log("Importing Task List:");
        printTaskList(); // Temporary call to make sure the task list object is working correctly
    });

    exportBTN.addEventListener("click", () => {
        // Export functionality would go here
        console.log("Exporting Task List:");
    });
});