import 'dotenv/config'
import { BrowserWindow, app, ipcMain } from 'electron'
import mainWin from './windows/main'
import info from '../package.json'
import { isHaveUpdate } from './utils/autoUpdate'

let win: BrowserWindow | undefined
function main() {
  app.on('window-all-closed', () => {
    app.quit()
  })

  // 单实例锁
  const gotTheLock = app.requestSingleInstanceLock()
  if (gotTheLock) {
    // 当运行第二个实例时，将焦点聚焦到主窗口
    app.on('second-instance', () => {
      if (win) {
        if (win.isMinimized()) win.restore()
        win.focus()
      }
    })
    app.whenReady().then(async () => {
      win = await mainWin()
    })
  } else {
    app.quit()
  }
}

main()
