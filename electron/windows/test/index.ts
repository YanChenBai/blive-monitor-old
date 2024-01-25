import { BrowserView, BrowserWindow, Menu, app, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'
import css from './css'

export default async function () {
  // 创建窗口
  const win = new BrowserWindow({
    transparent: false,
    frame: false,
    show: true,
    backgroundColor: '#101014',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, './preload.js')
    }
  })

  if (!app.isPackaged) {
    win.webContents.openDevTools({
      mode: 'detach',
      activate: true
    })
  }

  const win_id = win.id

  // 注入css
  win.webContents.insertCSS(css)
  win.webContents.insertCSS(
    fs.readFileSync(path.join(__dirname, '../../../render/dist_plugin/assets/plugin.css'), 'utf-8')
  )

  win.webContents.executeJavaScript(
    fs.readFileSync(path.join(__dirname, '../../../render/dist_plugin/assets/plugin.js'), 'utf-8')
  )
  win.loadURL(`https://live.bilibili.com/blanc/732?win_id=${win_id}`)

  return win
}
