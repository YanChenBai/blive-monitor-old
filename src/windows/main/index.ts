import { BrowserWindow, Menu, app, ipcMain } from 'electron'
import path from 'path'
import liveWin from '../live'
import biliWin from '../bili'
import type { UserInfo, RoomInfo, OpenRoom } from '../../types/bili'

async function getInfo(id: string) {
  const { uid, short_id } = await fetch(
    `https://api.live.bilibili.com/room/v1/Room/get_info?id=${id}`
  )
    .then((res) => res.json() as Promise<RoomInfo>)
    .then((res) => {
      if (res.code === 0) {
        return {
          uid: res.data.uid,
          short_id: res.data.short_id
        }
      } else {
        return Promise.reject(res)
      }
    })

  return await fetch(`https://api.live.bilibili.com/live_user/v1/Master/info?uid=${uid}`)
    .then((res) => res.json() as Promise<UserInfo>)
    .then((res) => {
      if (res.code === 0) {
        return {
          uid: String(uid),
          room_id: String(res.data.room_id),
          short_id: String(short_id),
          name: res.data.info.uname,
          face: res.data.info.face
        }
      } else {
        return Promise.reject(res)
      }
    })
}

export default async function () {
  const win = new BrowserWindow({
    width: 460,
    height: 600,
    transparent: false,
    frame: false,
    show: true,
    resizable: false,
    backgroundColor: '#101014',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, '../preload.js'),
      webviewTag: true
    }
  })

  const loadURL = app.isPackaged
    ? path.resolve(__dirname, '../../../render/dist/index.html')
    : 'http://localhost:5173'

  win.loadURL(loadURL)

  // 关闭主窗口退出整个应用
  win.on('close', () => {
    app.quit()
  })

  if (!app.isPackaged) {
    win.webContents.openDevTools({
      mode: 'detach',
      activate: true
    })
  }

  /** 关闭窗口 */
  ipcMain.on('main:close', () => {
    win.close()
    app.quit()
  })

  // 最小化窗口
  ipcMain.on('main:min', () => {
    win.minimize()
  })

  // 获取直播间信息
  ipcMain.on('main:getRoomInfo', (event, id) => {
    getInfo(id).then((res) => event.reply('main:getRoomInfo', res))
  })

  // 打开直播
  ipcMain.on('main:openLive', (_event, options: OpenRoom) => {
    liveWin(options)
  })

  // 打开b站首页登录
  ipcMain.on('main:openBili', () => biliWin())

  // 获取窗口数量, 排除主窗口
  ipcMain.handle(
    'main:winCount',
    () => BrowserWindow.getAllWindows().filter((item) => item.id !== win.id).length
  )

  Menu.setApplicationMenu(null)
  return win
}
