import { BrowserWindow, Menu, app, ipcMain } from 'electron'
import path from 'path'
import liveWin from '../live'
import biliWin from '../bili'
import type { UserInfo, RoomInfo, OpenRoom } from '../../types/bili'
import autoUpdater from '../../utils/autoUpdater'
import { logger } from '../../utils/logger'

/**
 * 获取直播间信息
 * @param room_id 房间号, 支持短号
 */
async function getInfo(room_id: string) {
  const { uid, short_id, tags, live_status, title } = await fetch(
    `https://api.live.bilibili.com/room/v1/Room/get_info?id=${room_id}`
  )
    .then((res) => res.json() as Promise<RoomInfo>)
    .then((res) => {
      if (res.code === 0) {
        return {
          uid: res.data.uid,
          short_id: res.data.short_id,
          tags: res.data.tags,
          live_status: res.data.live_status,
          title: res.data.title
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
          face: res.data.info.face,
          live_status: live_status,
          tags: tags,
          title,
          medal_name: res.data.medal_name
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

  const loadURL = !app.isPackaged
    ? path.resolve(__dirname, '../../../render/dist/index.html')
    : 'http://localhost:5173'

  win.loadURL(loadURL)

  // 关闭主窗口退出整个应用
  win.on('close', () => {
    app.quit()
  })

  win.webContents.openDevTools({
    mode: 'detach',
    activate: true
  })

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
  ipcMain.handle('main:getRoomInfo', async (_e, room_id: string) => await getInfo(room_id))

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
