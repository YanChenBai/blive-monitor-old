import 'dotenv/config'
import { BrowserWindow, app, Notification, ipcMain } from 'electron'
import mainWin from './windows/main'
import path from 'path'
import { isExists } from './utils/isExists'
import autoUpdater from './utils/autoUpdater'
import { logger } from './utils/logger'

Object.defineProperty(app, 'isPackaged', {
  get() {
    return true
  }
})

function checkIconsDir() {
  // 检查icons文件夹
  const iconDirPath = app.isPackaged
    ? path.resolve(process.resourcesPath + '\\icons')
    : path.resolve(__dirname, '../../../icon')
  isExists(iconDirPath)
}

let isNotify = false
let win: BrowserWindow | undefined
function main() {
  app.on('window-all-closed', () => {
    app.quit()
  })

  // 单实例锁
  const gotTheLock = app.requestSingleInstanceLock()
  if (gotTheLock) {
    // 一些初始化的东西
    checkIconsDir()

    // 当运行第二个实例时，将焦点聚焦到主窗口
    app.on('second-instance', () => {
      if (win) {
        if (win.isMinimized()) win.restore()
        win.focus()
      }
    })

    app.whenReady().then(async () => {
      win = await mainWin()

      autoUpdater.checkForUpdates()
      const timer = setInterval(() => autoUpdater.checkForUpdates(), 1000 * 60 * 15)

      // 有新的版本
      // autoUpdater.addListener('update-available', (event) => {
      //   if (isNotify) return
      //   // 加锁
      //   isNotify = true

      //   // log
      //   logger.info('New version', event.version)

      //   // 通知
      //   const notification = new Notification({
      //     title: `✨发现新版本咯 v${event.version}`,
      //     body: '点击下载并安装, 会退出哦',
      //     icon: path.resolve(__dirname, '../blivemonitor.ico')
      //   })

      //   // 点击通知下载
      //   notification.addListener('click', () => autoUpdater.downloadUpdate())
      //   notification.show()
      //   clearInterval(timer)
      // })

      // 下载完成
      autoUpdater.addListener('update-downloaded', (event) => {
        logger.info('--> New version', event.version)

        // 通知
        const notification = new Notification({
          title: `👌下载完喽 v${event.version}`,
          body: '点击安装',
          icon: path.resolve(__dirname, '../blivemonitor.ico')
        })

        // 点击通知安装
        notification.addListener('click', () => autoUpdater.quitAndInstall())
        notification.show()

        win?.webContents.send('update:downloaded', true)
        // 清楚进度条
        win?.setProgressBar(-1)
      })

      // 进度更新
      autoUpdater.addListener('download-progress', (info) => {
        win?.setProgressBar(info.percent / 100)
        win?.webContents.send('update:downloadProgress', info)
      })

      // 更新错误重试
      autoUpdater.addListener('error', () => {
        const notification = new Notification({
          title: `😵 更新错误`,
          body: '点击重试',
          icon: path.resolve(__dirname, '../blivemonitor.ico')
        })

        // 点击通知安装
        notification.addListener('click', () => autoUpdater.checkForUpdates())
        notification.show()
      })

      autoUpdater.checkForUpdates().then((res) => {
        logger.info('--> 检查更新', res?.updateInfo)
      })

      // 获取当前版本
      ipcMain.handle('update:version', () => autoUpdater.currentVersion.version)

      // 获取可更新
      ipcMain.handle('update:check', async () => await autoUpdater.checkForUpdates())

      // 下载更新
      ipcMain.handle('update:download', async () => await autoUpdater.downloadUpdate())

      // 退出并安装
      ipcMain.handle('update:quitAndInstall', () => autoUpdater.quitAndInstall())
    })
  } else {
    app.quit()
  }
}

main()
