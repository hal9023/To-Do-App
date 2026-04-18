const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI',{
    openTaskFile: () => ipcRenderer.invoke('dialog:open-task-file'),
    saveTaskFile: (content: string) => ipcRenderer.invoke('dialog:save-task-file', content),
    readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
    // updateQuickSelectorFile: (path, data) => ipcRenderer.invoke('update-quick-selector-file', path, data)
});