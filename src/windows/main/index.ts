import { BrowserWindow, Menu, app, ipcMain } from 'electron'
import path from 'path'
import liveWin from '../live'
import biliWin from '../bili'
import type { OpenRoom } from '../../types/bili'
import { getInfo, getManyInfo } from '../../utils/getRoomInfo'
import { renderPath } from '../../utils/paths'

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
      webviewTag: true,
      spellcheck: false
    }
  })

  win.loadURL(renderPath)

  // 关闭主窗口退出整个应用
  win.on('close', () => {
    app.quit()
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

  // 批量获取直播间信息
  ipcMain.handle('main:getManyRoomInfo', async (_e, uids: string[]) => await getManyInfo(uids))

  // 打开直播
  ipcMain.on('main:openRoom', (_event, options: OpenRoom) => liveWin(options))

  // 打开b站首页登录
  ipcMain.on('main:openBili', () => biliWin())

  // 获取窗口数量, 排除主窗口
  ipcMain.handle(
    'main:winCount',
    () => BrowserWindow.getAllWindows().filter((item) => item.id !== win.id).length
  )

  Menu.setApplicationMenu(null)

  if (!app.isPackaged) {
    win.webContents.openDevTools({
      mode: 'detach',
      activate: true
    })
  }

  return win
}
