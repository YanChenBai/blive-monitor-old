import { autoUpdater } from 'electron-updater'
import { logger } from './logger'
import path from 'path'
import { BrowserWindow, app } from 'electron'

// 配置自动更新
if (!app.isPackaged) {
  autoUpdater.updateConfigPath = path.join(__dirname, '../../dev-app-update.yml')
}
autoUpdater.logger = logger
autoUpdater.autoDownload = false

// 自动更新初始化
function initAutoUpdater(win: BrowserWindow) {}

export default autoUpdater
