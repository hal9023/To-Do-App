const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openTaskFile: () => ipcRenderer.invoke('dialog:open-task-file'),
    saveTaskFile: (content) => ipcRenderer.invoke('dialog:save-task-file', content),
    readFile: (path) => ipcRenderer.invoke('read-file', path),
    updateQuickSelectorFile: (path, data) => ipcRenderer.invoke('update-quick-selector-file', path, data)
});
