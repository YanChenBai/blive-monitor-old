import { BrowserWindow, Menu, app, ipcMain } from 'electron'
import path from 'path'
import { v4 } from 'uuid'

export default async function (room_id: string, name: string) {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: false,
    frame: false,
    show: true,
    backgroundColor: '#101014',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, '../preload.js'),
      webviewTag: true
    }
  })

  if (!app.isPackaged) {
    win.webContents.openDevTools({
      mode: 'detach',
      activate: true
    })
  }

  const win_id = v4()

  const loadURL = app.isPackaged
    ? path.resolve(__dirname, '../../../dist-render/index.html')
    : 'http://localhost:5173'

  win.loadURL(`${loadURL}#/live?win_id=${win_id}&room_id=${room_id}&name=${name}`)

  ipcMain.on(`close:${win_id}`, () => win.close())

  Menu.setApplicationMenu(null)
  return win
}
