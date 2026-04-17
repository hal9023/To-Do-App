import { app, BrowserWindow, ipcMain, dialog } from 'electron';

const path = import('path');
const fs = import('fs');


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            //preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }

    })

    win.loadFile('index.html')

    win.webContents.openDevTools(); // Opens the console on launch for debugging
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})