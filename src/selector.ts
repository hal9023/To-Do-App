interface ImportedFile {
    content: string;
    filePath: string;
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
    filePath: string;
    selected: boolean = false;
    
    constructor(title: string, filePath: string) {
        this.uID = Date.now();
        this.title = title;
        this.filePath = filePath;

        console.log ('Task List Identified: ${this.title}, File Path: ${this.filePath}, Selected: ${this.selected}');

        
    }
   toJSON() {
        return {
            uID: this.uID,
            title: this.title,
            filePath: this.filePath,
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

        document.getElementById("selectorContainer")?.appendChild(listDiv);
    }   
    renderList() {
        // Will be written to load in task list
        // Can probably just reuse existing function for this
    }
}    

