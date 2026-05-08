interface ImportedFile {
    content: string;
    filePath: string;
}
interface ImportedTaskList {
    uId: number;
    title: string;
    file: ImportedFile;
    selected: boolean;
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
    description: string;
    done: boolean;
    indents: number;
    selected: boolean = false;
    deleted: boolean = false;
    file: ImportedFile;
    
    constructor(title: string, file: ImportedFile) {
        /*
            This constructor right now has everything that represents a feature that will be added in
            later in development hard coded for the sake of intercompatibility with the
            task data structure
        */

        this.uID = Date.now();
        this.title = title;
        this.description = "";
        this.done = false;
        this.indents = 0;
        this.selected = false;
        this.deleted = false;
        this.file = file;

        console.log(`Task List Identified: ${this.title}, File Path: ${this.file.filePath}, Selected: ${this.selected}`);
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
        listDiv.id = `task-${this.uID}`;

        const button = document.createElement("button");

        Object.assign(button, {
            id: `button-${this.title}`,
            className: "list-button",
            textContent: this.title,
            onclick: () => {
                this.renderList();
                console.log(`List Rendered: ${this.title}`);
            }
        });

        listDiv.appendChild(button);

        document.getElementById("quick-selector-container")?.appendChild(listDiv);

        return listDiv;
    }   

    renderList() {
        // Will be written to load in task list
        // Can probably just reuse existing function for this
        
        clearTDL(allTasks);

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

let allLists: taskList[] = [];

function addToSelector (file: ImportedFile) {
    if (!file) {
        console.log("No file data selected");
        return;
    }

    // As it is, this line makes the title of the task list the path of the file
    // This is VERY ugly so I'll change it to something else when I work out the ifle ofmrat

    const title = file.filePath.split('\\').pop()?.replace('.json', '') || 'Untitled List';

    const createdList = new taskList(title, file);
    createdList.createListElement();

    console.log(allTasks);
    allLists.push(createdList);
    console.log(allLists);

}

function exportQuickSelector(masterList: taskList[]) {
    // Save the files present within the quick selector to a file.

    const jsonDATA = JSON.stringify(masterList.map(list => list.toJSON()), null, 2);
    console.log(jsonDATA);

    // Log to file
    window.electronAPI.saveTaskFile(jsonDATA)
        .then((savedPath: void) => {
            console.log("File saved successfully.");
        })
        .catch((error: any) => {
            console.error("Error saving file:", error);
        });
}

async function importQuickSelector () {
    // First, clear the quick selector and all lists
    clearQuickSelector(allLists);

    // Grab file, parse contents, render quick selector.
    const file = await window.electronAPI.openTaskFile();
    if (!file) {
        console.log("No file data selected");
        return;
    }

    file.forEach((files: ImportedFile) => {
        const importedLists = JSON.parse(files.content) as ImportedTaskList[];

        // Check JSON integrity
        importedLists.forEach((listData) => {
            if (!('uID' in listData)) {
                console.log ("Task List is missing uID! Property");
            }
            else if (!('title' in listData)) {
                console.log ("Task List is missing Title! Property");
            }
            else if (!('file' in listData)) {
                console.log ("Task List is missing File! Property");
            }
            else if (!('selected' in listData)) {
                console.log ("Task List is missing Selected Property!");
            }
        });

        importedLists.forEach((listData) => {
            const importedList = new taskList (
                listData.title,
                listData.file,
            );
            allLists.push(importedList);
            importedList.createListElement();
        });
    });

}

function clearQuickSelector(masterList: taskList[]) {
    masterList.forEach((list) => {
        const listElement = document.getElementById(`task-${list.uID}`);
        if (listElement) {
            listElement.remove();
        }
    });
    masterList = [];
}

function taskListToTask(list: taskList): task[] {
    // Function takes in an object of type task list and converts it to an array of tasks that can be compared with other task data

    /*
        Task List structure:

        uID: number
        title: string
        description: string
        done: boolean
        indents: number
        selected: boolean = false
        deleted: boolean = false
        file: ImportedFile

        Task Structure:

        uID: number
        title: string
        description: string
        done: boolean
        indents: number
        selected: boolean
        deleted: boolean

    */

    

    return []; // Placeholder for proper return staetment
}
function updatequickSelector(quickSelector: taskList[], folderPath: string) {
    // Function that reads every file (if it exists) in the quick selector
    // Compares it with the version loaded in the quick selector file
    // If there are differences, update the quick selector version to match the file version

    // Only works for lists that are in the defined directory for the program

    const fields = ['uID', 'title', 'description', 'done', 'indents', 'selected'];

    quickSelector.forEach((List) => {
        const filePath = List.file.filePath;

        /*
            this block of code matches the file paths
            reads the data from the path and imports it
            as an array of task objects; basically it reads the file and breaks it down
            into a bunch of tasks=
        */
        if (filePath.startsWith(folderPath)) {
            window.electronAPI.readFile(filePath)
                .then((content: string) => {
                    const fileData = JSON.parse(content) as ImportedTask[];
                    // Check JSON integrity

                    let complete: boolean = true;
                    /*
                     Going to reimplement this with a foreach 
                     that iterates over the individual fields rather than
                     using a ton of elif statements
                    */
                    fileData.forEach((taskData) => {
                        if (!('uID' in taskData)) {
                            console.log ("Task is missing uID!");
                            complete = false;
                        }
                        else if (!('title' in taskData)) {
                            console.log ("Task is missing Title Property!");
                            complete = false;
                        }
                        else if (!('description' in taskData)) {
                            console.log ("Task is missing Description Property!");
                            complete = false;
                        }
                        else if (!('done' in taskData)) {
                            console.log ("Task is missing Done Property!");
                            complete = false;
                        }
                        else if (!('indents' in taskData)) {
                            console.log ("Task is missing Indents Property!");
                            complete = false;
                        }
                        else if (!('selected' in taskData)) {
                            console.log ("Task is missing Selected Property!");
                            complete = false;
                        }        
                    });
                    if (complete) {
                        let equal: boolean = true;
                        fields.forEach((field) => {

                        });
                    }
                    else {
                        console.log(`File ${filePath} is incomplete! Quick Selector will not be updated with this file.`);
                    }
                })
                .catch((error: any) => {
                    console.error("Error reading file:", error);  
                });

        }
        else {
            console.log(`File ${filePath} is not in the specified directory and will be skipped.`);
        }

    });
}

document.addEventListener('DOMContentLoaded', () => {
    const addToSelectorButton = document.getElementById('importToDoList');
    const exportSelectorButton = document.getElementById('exportQuickSelect');
    const importSelectorButton = document.getElementById('importQuickSelect');
    const clearSelectorButton = document.getElementById('clearQuickSelect');
    // const updateSelectorbutton = document.getElementById('updateQuickSelect');

    addToSelectorButton?.addEventListener("click", () => {
        window.electronAPI.openTaskFile().then((files: ImportedFile[] | null) => {
            if (files) {
                files.forEach((file) => {
                    addToSelector(file);
                });
            } else {
                console.log("No file selected");
            }
        });
    });

    exportSelectorButton?.addEventListener("click", () => {
        exportQuickSelector(allLists);
    });

    importSelectorButton?.addEventListener("click", () => {
        importQuickSelector();
    });

    clearSelectorButton?.addEventListener("click", () => {
        clearQuickSelector(allLists);
    });
});
