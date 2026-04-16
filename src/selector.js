// Create file dialog, add a button for each selected file, when button is clicked
// display the tasks in that file on the screen

let taskFiles = [];

function exportSelector() {
    const quickSelectorData = JSON.stringify(taskFiles, null, 2);

    window.electronAPI.saveTaskFile(quickSelectorData)
        .then((savedPath) => {
            if (savedPath) {
                console.log(`Quick selector successfully exported to ${savedPath}`);
            }
        })
        .catch((error) => {
            console.error("Error writing quick selector to file:", error);
        });
}

function clearQuickSelector() {
    taskFiles = [];
    const selectorContainer = document.querySelector(".selectorButton");
    const buttons = selectorContainer.querySelectorAll('button');
    buttons.forEach(button => button.remove());
    console.log("Quick selector cleared.");
}

function addQuickSelectorButton(fileName, fileContents) {
    taskFiles.push({ name: fileName, content: fileContents });
    const selectorContainer = document.querySelector(".selectorButton");
    const newButton = document.createElement("button");
    newButton.textContent = fileName.substring(0, fileName.lastIndexOf('.')) || fileName; // Remove extension for button label
    newButton.addEventListener("click", () => {
        try {
            const taskList = JSON.parse(fileContents);
            displayTaskList(taskList);
        } catch (error) {
            console.error("Failed to parse task list:", error);
        }
    });
    selectorContainer.appendChild(newButton);
}

// Import List and Clear event listener
document.addEventListener("DOMContentLoaded", () => {
    const importSelectorBTN = document.getElementById("importToDoList");
    const clearSelectorBTN = document.getElementById("clearSelector");

    importSelectorBTN.addEventListener("click", async () => {
        const fileData = await window.electronAPI.openTaskFile();
        if (!fileData) return;

        const { name: fileName, content: fileContents } = fileData;

        try {
            const taskList = JSON.parse(fileContents);
            console.log("Task list imported successfully:");
            console.log(taskList);
        } catch (error) {
            console.error("Failed to parse task list:", error);
            return;
        }

        addQuickSelectorButton(fileName, fileContents);
    });

    clearSelectorBTN.addEventListener("click", () => {
        clearQuickSelector();
    });

    const importQuickSelectBTN = document.getElementById("importQuickSelect");
    const exportSelectorBTN = document.getElementById("exportQuickSelect");

    importQuickSelectBTN.addEventListener("click", async () => {
        const fileData = await window.electronAPI.openTaskFile();
        if (!fileData) return;

        const { name: fileName, content: fileContents } = fileData;

        let importedSelector;
        try {
            importedSelector = JSON.parse(fileContents);
        } catch (error) {
            console.error("Failed to parse quick selector file:", error);
            return;
        }

        if (!Array.isArray(importedSelector)) {
            console.error("Imported quick selector file must contain an array of selector entries.");
            return;
        }

        clearQuickSelector();

        importedSelector.forEach((entry) => {
            if (entry && typeof entry.name === "string" && typeof entry.content === "string") {
                addQuickSelectorButton(entry.name, entry.content);
            }
        });
        console.log(`Imported quick selector from ${fileName}`);
    });

    exportSelectorBTN.addEventListener("click", () => {
        exportSelector();
        console.log("Exporting quick selector...");
    });
});