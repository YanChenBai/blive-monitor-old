import { BrowserWindow, Menu, app, ipcMain } from 'electron'
import path from 'path'
import { v4 } from 'uuid'
import fs from 'fs'
import type { OpenRoom } from '../../types'
import axios from 'axios'

const iconPath = app.isPackaged
  ? path.join(process.resourcesPath, '../../../dist/icons')
  : path.join(__dirname, '../../../icons')

/** 查看有没有图标 */
async function isHaveIcon(room_id: string) {
  if (fs.existsSync(path.join(iconPath, `${room_id}.png`))) {
    return true
  } else {
    return false
  }
}

/** 保存图标 */
async function saveIcon(room_id: string, url: string) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    fs.writeFileSync(path.resolve(iconPath, room_id + '.png'), response.data)
  } catch (error) {
    console.error(error)
  }
}

export default async function (options: OpenRoom) {
  /** 看看要不要保存图标 */
  if (!(await isHaveIcon(options.room_id))) await saveIcon(options.room_id, options.face)

  const win = new BrowserWindow({
    width: 600,
    height: 340,
    transparent: false,
    frame: false,
    show: true,
    icon: path.resolve(iconPath, options.room_id + '.png'),
    backgroundColor: '#101014',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, './preload.js'),
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

  options.model
    ? win.loadURL(
        `${loadURL}#/live?win_id=${win_id}&room_id=${options.room_id}&name=${options.name}`
      )
    : win.loadURL(`https://live.bilibili.com/${options.room_id}`)

  ipcMain.on(`close:${win_id}`, () => win.close())

  Menu.setApplicationMenu(null)
  return win
}
