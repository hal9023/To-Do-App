// Create file dialog, add a button for each selected file, when button is clicked
// display the tasks in that file on the screen

let taskFiles = [];
let nextQuickSelectorId = 1;

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
    const selectorContainer = document.querySelector(".quick-selector-container");
    const items = selectorContainer.querySelectorAll('.quick-selector-item');
    items.forEach(item => item.remove());
    console.log("Quick selector cleared.");
}

function removeQuickSelectorEntry(id) {
    taskFiles = taskFiles.filter(entry => entry.id !== id);
    const item = document.querySelector(`.quick-selector-item[data-selector-id="${id}"]`);
    if (item) {
        item.remove();
    }
}

function addQuickSelectorButton(fileName, fileContents, filePath) {
    const id = nextQuickSelectorId++;
    taskFiles.push({ id, name: fileName, content: fileContents, path: filePath });

    const selectorContainer = document.querySelector(".quick-selector-container");
    const itemWrapper = document.createElement("div");
    itemWrapper.className = "quick-selector-item";
    itemWrapper.dataset.selectorId = id;

    const newButton = document.createElement("button");
    newButton.className = "selectorButton";
    newButton.textContent = fileName.substring(0, fileName.lastIndexOf('.')) || fileName; // Remove extension for button label
    newButton.addEventListener("click", () => {
        document.querySelectorAll('.selectorButton').forEach(btn => btn.classList.remove('active'));
        newButton.classList.add('active');
        try {
            const taskList = JSON.parse(fileContents);
            displayTaskList(taskList);
        } catch (error) {
            console.error("Failed to parse task list:", error);
        }
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "selectorButton-delete deleteButton";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        removeQuickSelectorEntry(id);
    });

    itemWrapper.appendChild(newButton);
    itemWrapper.appendChild(deleteButton);
    selectorContainer.appendChild(itemWrapper);
}



// Import List and Clear event listener
document.addEventListener("DOMContentLoaded", () => {
    const importSelectorBTN = document.getElementById("importToDoList");
    const clearSelectorBTN = document.getElementById("clearSelector");

    importSelectorBTN.addEventListener("click", async () => {
        const fileDatas = await window.electronAPI.openTaskFile();
        if (!fileDatas || !Array.isArray(fileDatas)) return;

        fileDatas.forEach(({ path: filePath, name: fileName, content: fileContents }) => {
            try {
                const taskList = JSON.parse(fileContents);
                console.log("Task list imported successfully:");
                console.log(taskList);
            } catch (error) {
                console.error("Failed to parse task list:", error);
                return;
            }
            addQuickSelectorButton(fileName, fileContents, filePath);
        });
    });

    clearSelectorBTN.addEventListener("click", () => {
        clearQuickSelector();
    });

    const importQuickSelectBTN = document.getElementById("importQuickSelect");
    const exportSelectorBTN = document.getElementById("exportQuickSelect");

    importQuickSelectBTN.addEventListener("click", async () => {
        const fileDatas = await window.electronAPI.openTaskFile();
        if (!fileDatas || !Array.isArray(fileDatas) || fileDatas.length === 0) return;

        const { name: fileName, content: fileContents } = fileDatas[0];

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
                addQuickSelectorButton(entry.name, entry.content, entry.path || null);
            }
        });
        console.log(`Imported quick selector from ${fileName}`);
    });

    exportSelectorBTN.addEventListener("click", () => {
        exportSelector();
        console.log("Exporting quick selector...");
    });

    const updateQuickSelectBTN = document.getElementById("updateQuickSelect");
    updateQuickSelectBTN.addEventListener("click", async () => {
        const fileDatas = await window.electronAPI.openTaskFile();
        if (!fileDatas || !Array.isArray(fileDatas) || fileDatas.length === 0) return;

        const { path: updateFilePath, content: updateFileContents } = fileDatas[0];

        let quickSelector;
        try {
            quickSelector = JSON.parse(updateFileContents);
        } catch (error) {
            console.error("Failed to parse quick selector file:", error);
            return;
        }

        if (!Array.isArray(quickSelector)) {
            console.error("Quick selector file must contain an array.");
            return;
        }

        // Update each entry
        for (let entry of quickSelector) {
            if (entry.path) {
                try {
                    entry.content = await window.electronAPI.readFile(entry.path);
                    console.log(`Updated content for ${entry.name}`);
                } catch (error) {
                    console.error(`Failed to read updated content for ${entry.name}:`, error);
                }
            } else {
                console.log(`No path for ${entry.name}, skipping update`);
            }
        }

        // Overwrite the file
        const updatedData = JSON.stringify(quickSelector, null, 2);
        try {
            await window.electronAPI.updateQuickSelectorFile(updateFilePath, updatedData);
            console.log(`Updated quick selector file at ${updateFilePath}`);
        } catch (error) {
            console.error("Failed to overwrite quick selector file:", error);
        }
    });
});
// styling for quick selector buttons
