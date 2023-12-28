import { autoUpdater } from 'electron-updater'
import { logger } from './logger'
import path from 'path'
import { app } from 'electron'

if (!app.isPackaged) autoUpdater.updateConfigPath = path.join(__dirname, '../../dev-app-update.yml')
autoUpdater.logger = logger
autoUpdater.autoDownload = false
export default autoUpdater
