const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    win.loadFile('index.html')
}

ipcMain.handle('dialog:open-task-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'JSON', extensions: ['json'] }]
    })
    if (canceled || filePaths.length === 0) return null

    const files = await Promise.all(filePaths.map(async (filePath, i) => {
        const content = await fs.promises.readFile(filePath, 'utf8')
        const name = path.basename(filePath)
        return { path: filePath, name, content }
    }))
    return files
})

ipcMain.handle('read-file', async (event, filePath) => {
    return await fs.promises.readFile(filePath, 'utf8');
});

ipcMain.handle('update-quick-selector-file', async (event, filePath, data) => {
    await fs.promises.writeFile(filePath, data, 'utf8');
    return true;
});

ipcMain.handle('dialog:save-task-file', async (event, content) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        title: 'Save Task List',
        defaultPath: 'tasks.json',
        filters: [{ name: 'JSON', extensions: ['json'] }]
    })
    if (canceled || !filePath) return null

    await fs.promises.writeFile(filePath, content, 'utf8')
    return filePath
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})