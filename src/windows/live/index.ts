import { BrowserView, BrowserWindow, Menu, app, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'
import type { Room } from '../../types/bili'
import axios from 'axios'
import { logger } from '../../utils/logger'
import css from './assets/css'
import crypto from 'crypto'
import { ICONS_PATH } from '../../utils/paths'
import { useService } from './service'
import sharp from 'sharp'

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

async function composeFace(rooms: Room[]) {
  if (rooms.length < 2) throw new Error('房间数小于2')

  rooms = rooms.sort((a, b) => parseInt(a.room_id) - parseInt(b.room_id))
  const imgName = rooms.map((room) => md5(room.face)).join('_')
  const imgPath = path.join(ICONS_PATH, `${md5(imgName)}.png`)
  const status = isCached(imgName)

  if (status) {
    return imgPath
  } else {
    // 处理没缓存的情况
    const compositeImage = sharp({
      create: {
        width: 256,
        height: 256,
        channels: 4, // 使用 RGBA 模式
        background: { r: 255, g: 255, b: 255, alpha: 0 } // 设置背景透明
      }
    })
    const layout = [
      [
        { x: 0, y: 64 },
        { x: 128, y: 64 }
      ],
      [
        { x: 0, y: 64 },
        { x: 128, y: 0 },
        { x: 128, y: 128 }
      ],
      [
        { x: 0, y: 0 },
        { x: 128, y: 0 },
        { x: 0, y: 128 },
        { x: 128, y: 128 }
      ]
    ]
    const list: sharp.OverlayOptions[] = []
    for (let index = 0; index < rooms.length; index++) {
      const face = await getFace(rooms[index].face)
      list.push({
        input: await sharp(face).resize(128, 128).toBuffer(),
        top: layout[rooms.length - 2][index].y,
        left: layout[rooms.length - 2][index].x
      })
    }

    await compositeImage.composite(list).toFile(imgPath)
    return imgPath
  }
}

async function getWinInfo(rooms: Room[]) {
  let icon = ''
  if (rooms.length > 1) {
    icon = await composeFace(rooms)
  } else {
    icon = await getFace(rooms[0].face)
  }
  return {
    title: rooms.map((room) => room.name).join(' | '),
    id: rooms
      .map((room) => room.room_id)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .join('_'),
    icon
  }
}

export default async function (rooms: Room[]) {
  const { title, id, icon } = await getWinInfo(rooms)

  // 初始化配置
  const service = await useService(id)
  const roomConfig = service.getRoomConfig()
  const defWidth = [600, 600, 600, 600 * 2][rooms.length - 1]
  const defHeight = [336, 336 * 2, 336 * 3, 336 * 2][rooms.length - 1]

  const getSize = () => ({
    width: roomConfig.width || defWidth,
    height: roomConfig.height || defHeight
  })

  const getPosition = () =>
    roomConfig.x && roomConfig.y
      ? {
          x: roomConfig.x,
          y: roomConfig.y
        }
      : {}

  // 创建窗口
  const win = new BrowserWindow({
    ...getSize(),
    ...getPosition(),
    transparent: false,
    frame: false,
    show: true,
    icon,
    title,
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

  const winId = win.id

  rooms.forEach((room, index) => {
    const bliveView = new BrowserView({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        preload: path.join(__dirname, './preload.js')
      }
    })
    // 注入css
    bliveView.webContents.insertCSS(css)

    const { width, height } = getSize()
    const half_width = parseInt((width / 2).toFixed(0))
    const half_height = parseInt((height / 2).toFixed(0))
    // const one_third_width = parseInt((width / 3).toFixed(0))
    const one_third_height = parseInt((height / 3).toFixed(0))

    // 设置窗口标题
    const layout = [
      [{ width, height, x: 0, y: 0 }],
      [
        { width, height: half_height, x: 0, y: 0 },
        { width, height: half_height, x: 0, y: half_height }
      ],
      [
        { width: width, height: one_third_height, x: 0, y: 0 },
        { width: width, height: one_third_height, x: 0, y: one_third_height },
        { width: width, height: one_third_height, x: 0, y: one_third_height * 2 }
      ],
      [
        { width: half_width, height: half_height, x: 0, y: 0 },
        { width: half_width, height: half_height, x: half_width, y: 0 },
        { width: half_width, height: half_height, x: 0, y: half_height },
        { width: half_width, height: half_height, x: half_width, y: half_height }
      ]
    ]

    bliveView.setBounds(layout[rooms.length - 1][index])

    bliveView.setAutoResize({
      horizontal: true,
      vertical: true
    })
    bliveView.webContents.loadURL(
      `https://live.bilibili.com/${room.room_id}?win_id=${winId}&room_id=${room.room_id}`
    )
    win.addBrowserView(bliveView)
  })

  // 监听窗口关闭
  ipcMain.on(`close:${winId}`, () => win.close())

  // 最小化窗口
  ipcMain.on(`min:${winId}`, () => win.minimize())

  // 获取房间数据
  ipcMain.handle(`getRoomData:${winId}`, (e, roomId: string) =>
    rooms.find((room) => room.room_id === roomId)
  )

  // 不同数量下的窗口比例
  const aspectRatio = [16 / 9, 16 / 18, 16 / 27, 16 / 9]
  // 设置保持比例
  const setKeepAspectRatio = (state: boolean) =>
    state ? win.setAspectRatio(aspectRatio[rooms.length - 1]) : win.setAspectRatio(0)

  // 初始化是否保持比例
  if (roomConfig.isKeepAspectRatio) setKeepAspectRatio(true)

  // 初始化置顶状态
  if (roomConfig.isAlwaysOnTop) win.setAlwaysOnTop(true)

  // 获取置顶状态
  ipcMain.handle(`getAlwaysOnTop:${winId}`, () => service.getRoomConfig().isAlwaysOnTop)

  // 设置窗口置顶状态
  ipcMain.handle(`setAlwaysOnTop:${winId}`, (_event, is: boolean) => {
    win.setAlwaysOnTop(is)
    service.changeIsTop(is)
  })

  // 获取是否保持比例
  ipcMain.handle(`getKeepAspectRatio:${winId}`, () => service.getRoomConfig().isKeepAspectRatio)

  // 设置比例
  ipcMain.handle(`setKeepAspectRatio:${winId}`, (_event, is: boolean) => {
    setKeepAspectRatio(is)
    service.changeIsKeepAspectRatio(is)
  })

  win.on('close', () => {
    const { x, y, width, height } = win.getBounds()
    service.setPosition(x, y)
    service.setSize(width, height)
  })

  win.addListener('ready-to-show', () => win.focus())
  Menu.setApplicationMenu(null)
  return win
}
