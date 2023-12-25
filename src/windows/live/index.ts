import { BrowserWindow, Menu, app, ipcMain } from 'electron'
import path from 'path'
import { v4 } from 'uuid'
import fs from 'fs'
import type { OpenRoom } from '../../types'
import axios from 'axios'

const iconPath = app.isPackaged
  ? path.resolve(process.resourcesPath, '../../../dist/icons')
  : path.join(__dirname, '../../../icons')

/** 查看有没有图标 */
function isHaveIcon(room_id: string) {
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
  if (!isHaveIcon(options.room_id)) await saveIcon(options.room_id, options.face)

  /** 不同模式不配置 */
  const webPreferences = options.model
    ? { contextIsolation: true, preload: path.join(__dirname, '../preload.js') }
    : { contextIsolation: false, preload: path.join(__dirname, './preload.js') }

  /** 创建窗口 */
  const win = new BrowserWindow({
    width: 600,
    height: 340,
    transparent: false,
    frame: false,
    show: true,
    icon: path.resolve(iconPath, options.room_id + '.png'),
    backgroundColor: '#101014',
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      ...webPreferences
    }
  })

  if (!app.isPackaged) {
    win.webContents.openDevTools({
      mode: 'detach',
      activate: true
    })
  }

  /** 分配窗口id */
  const win_id = v4()

  /** 不同模式不同url */
  if (options.model) {
    const loadURL = app.isPackaged
      ? path.resolve(__dirname, '../../../dist-render/index.html')
      : 'http://localhost:5173'

    win.loadURL(`${loadURL}#/live?win_id=${win_id}&room_id=${options.room_id}&name=${options.name}`)
  } else {
    win.loadURL(`https://live.bilibili.com/${options.room_id}`)
  }

  /** 监听窗口关闭 */
  ipcMain.on(`close:${win_id}`, () => win.close())

  /** 最小化窗口  */
  ipcMain.on(`min:${win_id}`, () => win.minimize())

  Menu.setApplicationMenu(null)
  return win
}
