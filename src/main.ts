import 'dotenv/config'
import { BrowserWindow, app } from 'electron'
import mainWin from './windows/main'
import { isExists } from './utils/isExists'
import { initAutoUpdater } from './utils/autoUpdater'
import { iconsPath } from './utils/paths'

let win: BrowserWindow | undefined
function main() {
  app.setAppUserModelId('Blive Monitor')
  app.on('window-all-closed', () => {
    app.quit()
  })

  // 单实例锁
  const gotTheLock = app.requestSingleInstanceLock()
  if (gotTheLock) {
    // 一些初始化的东西
    isExists(iconsPath)

    // 当运行第二个实例时，将焦点聚焦到主窗口
    app.on('second-instance', () => {
      if (win) {
        if (win.isMinimized()) win.restore()
        win.focus()
      }
    })

    app.whenReady().then(async () => {
      win = await mainWin()
      initAutoUpdater(win)
    })
  } else {
    app.quit()
  }
}

main()
