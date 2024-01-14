import { BrowserView, BrowserWindow, Menu, app, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'
import type { OpenRoom } from '../../types/bili'
import axios from 'axios'
import { logger } from '../../utils/logger'
import css from './assets/css'
import crypto from 'crypto'
import { ICONS_PATH } from '../../utils/paths'
import { useService } from './service'

const md5 = (str: string) => crypto.createHash('md5').update(str).digest('hex')
/**
 * 查看图片是否缓存
 * @param url 图片地址
 */
function isCached(url: string) {
  const imgPath = path.join(ICONS_PATH, `${md5(url)}.png`)
  if (fs.existsSync(imgPath)) {
    return true
  } else {
    return false
  }
}

/**
 * 保存图片
 * @param url 图片地址
 */
async function saveImg(url: string, savePath: string) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    fs.writeFileSync(savePath, response.data)
    return true
  } catch (error) {
    logger.error(error)
    return false
  }
}

async function getFace(url: string) {
  const imgPath = path.join(ICONS_PATH, `${md5(url)}.png`)
  const status = isCached(url)
  if (status) {
    return imgPath
  } else {
    return (await saveImg(url, imgPath)) ? imgPath : ''
  }
}

export default async function (options: OpenRoom) {
  const icon = await getFace(options.face)

  // 创建窗口
  const win = new BrowserWindow({
    width: 600,
    height: 337,
    transparent: false,
    frame: false,
    show: true,
    icon,
    title: options.name,
    backgroundColor: '#101014',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (!app.isPackaged) {
    win.webContents.openDevTools({
      mode: 'detach',
      activate: true
    })
  }

  const win_id = win.id

  const bliveView = new BrowserView({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, './preload.js')
    }
  })

  // 注入css
  bliveView.webContents.insertCSS(css)
  bliveView.setBounds({ x: 0, y: 0, height: 337, width: 600 })
  bliveView.setAutoResize({
    width: true,
    height: true
  })
  bliveView.webContents.loadURL(`https://live.bilibili.com/${options.room_id}?win_id=${win_id}`)

  win.addBrowserView(bliveView)

  // 监听窗口关闭
  ipcMain.on(`close:${win_id}`, () => win.close())

  // 最小化窗口
  ipcMain.on(`min:${win_id}`, () => win.minimize())

  // 获取房间数据
  ipcMain.handle(`getRoomData:${win_id}`, () => options)

  // 设置保持比例
  const setKeepAspectRatio = (state: boolean) =>
    state ? win.setAspectRatio(16 / 9) : win.setAspectRatio(0)

  // 初始化配置
  const service = await useService(options)
  const roomConfig = service.getRoomConfig()

  // 初始化是否保持比例
  if (roomConfig.isKeepAspectRatio) setKeepAspectRatio(true)

  // 初始化置顶状态
  if (roomConfig.isAlwaysOnTop) win.setAlwaysOnTop(true)

  // 获取置顶状态
  ipcMain.handle(`getAlwaysOnTop:${win_id}`, () => service.getRoomConfig().isAlwaysOnTop)

  // 设置窗口置顶状态
  ipcMain.handle(`setAlwaysOnTop:${win_id}`, (_event, is: boolean) => {
    win.setAlwaysOnTop(is)
    service.changeIsTop(is)
  })

  // 获取是否保持比例
  ipcMain.handle(`getKeepAspectRatio:${win_id}`, () => service.getRoomConfig().isKeepAspectRatio)

  // 设置比例
  ipcMain.handle(`setKeepAspectRatio:${win_id}`, (_event, is: boolean) => {
    setKeepAspectRatio(is)
    service.changeIsKeepAspectRatio(is)
  })

  win.addListener('ready-to-show', () => win.focus())
  Menu.setApplicationMenu(null)
  return win
}
