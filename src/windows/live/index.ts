import { BrowserWindow, Menu, app, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'
import type { OpenRoom } from '../../types/bili'
import axios from 'axios'

const iconDirPath = app.isPackaged
  ? path.resolve(process.resourcesPath, 'icons')
  : path.resolve(__dirname, '../../../icon')

/**
 * 查看有没有图标
 * @param room_id 房间id
 */
function isHaveIcon(room_id: string) {
  if (fs.existsSync(path.join(iconDirPath, `${room_id}.png`))) {
    return true
  } else {
    return false
  }
}

/**
 * 保存头像
 * @param room_id 房间id
 * @param url 头像地址
 */
async function saveFace(room_id: string, url: string) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    fs.writeFileSync(path.resolve(iconDirPath, room_id + '.png'), response.data)
  } catch (error) {
    console.error(error)
  }
}

export default async function (options: OpenRoom) {
  // 看看要不要保存图标
  if (!isHaveIcon(options.room_id)) await saveFace(options.room_id, options.face)
  const icon = path.resolve(iconDirPath, options.room_id + '.png')

  // 创建窗口
  const win = new BrowserWindow({
    width: 600,
    height: 340,
    transparent: false,
    frame: false,
    show: true,
    icon,
    backgroundColor: '#101014',
    webPreferences: {
      nodeIntegration: false,
      webviewTag: true,
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
  const css = fs.readFileSync(path.resolve(__dirname, 'index.css')).toString()
  win.webContents.insertCSS(css)

  win.loadURL(`https://live.bilibili.com/${options.room_id}?win_id=${win_id}`)

  // 监听窗口关闭
  ipcMain.on(`close:${win_id}`, () => win.close())

  // 最小化窗口
  ipcMain.on(`min:${win_id}`, () => win.minimize())

  Menu.setApplicationMenu(null)
  return win
}
