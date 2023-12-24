import 'dotenv/config'
import { BrowserWindow, app } from 'electron'
import mainWin from './windows/main'

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
    app.whenReady().then(() => mainWin())
  } else {
    app.quit()
  }
}

main()
