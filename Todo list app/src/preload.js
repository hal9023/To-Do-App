const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openTaskFile: () => ipcRenderer.invoke('dialog:open-task-file'),
    saveTaskFile: (content) => ipcRenderer.invoke('dialog:save-task-file', content)
});
