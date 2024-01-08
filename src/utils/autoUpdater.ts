import { BrowserWindow, app, Notification, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { logger } from './logger'
import path from 'path'
import { isNewVresion } from './isNewVresion'
import { MSG_ICON_PATH } from './paths'

// 配置自动更新
if (!app.isPackaged) {
  // Object.defineProperty(app, 'isPackaged', {
  //   get() {
  //     return true
  //   }
  // })
  autoUpdater.updateConfigPath = path.join(__dirname, '../../dev-app-update.yml')
}
autoUpdater.logger = logger
autoUpdater.autoDownload = true

let isDownloaded = false
let isUpdateAvailable = false
let isError = false

// 新建通知
export function newNotification(title: string, body: string) {
  return new Notification({
    title,
    body,
    icon: MSG_ICON_PATH
  })
}

// 发送打开更新的事件
function renderOpenUpdate(win: BrowserWindow) {
  if (win.isMinimized()) win.show()
  win.webContents.send('update:openUpdate', true)
}

// 自动更新初始化
export async function initAutoUpdater(win: BrowserWindow) {
  autoUpdater.checkForUpdates()
  const timer = setInterval(() => autoUpdater.checkForUpdates(), 1000 * 60 * 15)

  // 有新的版本
  autoUpdater.addListener('update-available', (event) => {
    if (isUpdateAvailable) return
    logger.info(event)

    clearInterval(timer)
    isUpdateAvailable = true
    win.webContents.send('update:available', true)

    const notification = newNotification(`✨发现新版本 v${event.version}`, '芜湖!')
    notification.show()
    notification.addListener('click', () => renderOpenUpdate(win))
  })

  // 下载完成
  autoUpdater.addListener('update-downloaded', (event) => {
    if (isDownloaded) true
    isDownloaded = true

    logger.info(event)

    // 通知
    const notification = newNotification(`👌下载完喽 v${event.version}`, '芜湖!')
    notification.addListener('click', () => renderOpenUpdate(win))
    notification.show()

    win.webContents.send('update:downloaded', true)
    // 清除进度条
    win.setProgressBar(-1)
  })

  // 进度更新
  autoUpdater.addListener('download-progress', (info) => {
    win.setProgressBar(info.percent / 100)
    win.webContents.send('update:downloadProgress', info)
  })

  // 更新错误重试
  autoUpdater.addListener('error', () => {
    if (!isError) {
      isError = true
      newNotification(`😵 更新错误`, '点击重试').show()
      win.webContents.send('update:error', false)
    }
  })

  // 获取当前版本
  ipcMain.handle('update:version', () => autoUpdater.currentVersion.version)

  // 获取可更新
  ipcMain.handle('update:check', async () => {
    const res = await autoUpdater.checkForUpdates()
    if (res) {
      if (!isNewVresion(autoUpdater.currentVersion.version, res.updateInfo.version)) {
        return null
      } else {
        return res.updateInfo
      }
    } else {
      return null
    }
  })

  // 下载更新
  ipcMain.handle('update:download', async () => await autoUpdater.downloadUpdate())

  // 退出并安装
  ipcMain.handle('update:quitAndInstall', () => autoUpdater.quitAndInstall())

  ipcMain.handle('update:isDownloaded', () => isDownloaded)
  ipcMain.handle('update:isUpdateAvailable', () => isUpdateAvailable)
}

export default autoUpdater
