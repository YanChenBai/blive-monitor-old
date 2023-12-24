import { BrowserWindow, Menu, app, ipcMain } from 'electron'
import path from 'path'
import liveWin from '../live'
import biliWin from '../bili'

interface RoomInfo {
  code: number
  msg: string
  message: string
  data: {
    uid: number
    room_id: number
    short_id: number
    attention: number
    online: number
    is_portrait: boolean
    description: string
    live_status: number
    area_id: number
    parent_area_id: number
    parent_area_name: string
    old_area_id: number
    background: string
    title: string
    user_cover: string
    keyframe: string
    is_strict_room: boolean
    live_time: string
    tags: string
    is_anchor: number
    room_silent_type: string
    room_silent_level: number
    room_silent_second: number
    area_name: string
    // more...
  }
}

interface UserInfo {
  code: number
  msg: string
  message: string
  data: {
    info: {
      uid: number
      uname: string
      face: string
    }
    exp: { master_level: {} }
    follower_num: number
    room_id: number
    medal_name: string
    glory_count: number
    pendant: string
    link_group_num: number
    room_news: {
      content: string
      ctime: string
      ctime_text: string
    }
  }
}

interface Room {
  name: string
  face: string
  room_id: string
}

async function getInfo(id: string) {
  return await fetch(`https://api.live.bilibili.com/room/v1/Room/get_info?id=${id}`)
    .then((res) => res.json() as Promise<RoomInfo>)
    .then((res) => {
      if (res.code === 0) {
        return res.data.uid
      } else {
        return Promise.reject(res)
      }
    })
    .then((uid) => fetch(`https://api.live.bilibili.com/live_user/v1/Master/info?uid=${uid}`))
    .then((res) => res.json() as Promise<UserInfo>)
    .then((res) => {
      if (res.code === 0) {
        return {
          name: res.data.info.uname,
          face: res.data.info.face,
          room_id: String(res.data.room_id)
        }
      } else {
        return Promise.reject(res)
      }
    })
}

export default async function () {
  const win = new BrowserWindow({
    width: 400,
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
    ? path.resolve(__dirname, '../../../dist-render/index.html')
    : 'http://localhost:5173'

  win.loadURL(loadURL)

  if (!app.isPackaged) {
    win.webContents.openDevTools({
      mode: 'detach',
      activate: true
    })
  }

  /** 关闭窗口 */
  ipcMain.on('main:close', () => {
    win.close()
  })

  /** 获取直播间信息 */
  ipcMain.on('main:getRoomInfo', (event, id) => {
    getInfo(id).then((res) => event.reply('main:getRoomInfo', res))
  })

  /** 打开直播 */
  ipcMain.on('main:openLive', (_event, room: Room) => {
    liveWin(room.room_id, room.name)
  })

  /** 打开b站首页登录 */
  ipcMain.on('main:openBili', () => biliWin())

  Menu.setApplicationMenu(null)
  return win
}
