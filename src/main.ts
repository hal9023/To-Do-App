const {app, BrowserWindow, ipcMain, dialog, ipcMainInvokeEvent} = require('electron');
const path = require('path');
const fs = require('fs');


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: true  
        }

    })

    win.loadFile('index.html')

    win.webContents.openDevTools(); // Opens the console on launch for debugging
}
ipcMain.handle('dialog:open-task-file', async (event: any) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
       properties: ['openFile', 'multiSelections'],
       filters: [{ name: 'JSON Files', extensions: ['json']}] 
    }); 
    if (canceled || filePaths.length === 0) return null;

    const files = await Promise.all(filePaths.map(async (filePath:string) => {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        return { content, filePath };
    }));

    console.log(files);
    return files;
});
ipcMain.handle('dialog:save-task-file', async (event: any, content: string) => {
   const { canceled, filePath } = await dialog.showSaveDialog({
        title: 'Save To-Do List',
        defaultPath: 'todolist.json',
        filters: [{ name: 'JSON Files', extensions: ['json']}]
        });
    if (canceled || !filePath) return null;

    await fs.promises.writeFile(filePath, content, 'utf-8');
    return filePath;
});
ipcMain.handle('read-file', async (event: any, filePath: string) => {
    return await fs.promises.readFile(filePath, 'utf-8');
});

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
