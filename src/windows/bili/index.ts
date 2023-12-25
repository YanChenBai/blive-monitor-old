import { BrowserWindow, Menu, app } from 'electron'
import path from 'path'

export default async function () {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    transparent: false,
    frame: true,
    show: true,
    backgroundColor: '#101014',
    webPreferences: {
      preload: path.join(__dirname, './preload.js')
    }
  })

  if (!app.isPackaged) {
    win.webContents.openDevTools({
      mode: 'detach',
      activate: true
    })
  }

  win.loadURL('https://live.bilibili.com')

  Menu.setApplicationMenu(null)
  return win
}
