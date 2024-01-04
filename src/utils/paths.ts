import { app } from 'electron'
import path from 'path'
import { logger } from './logger'

export const renderPath = app.isPackaged
  ? path.resolve(app.getAppPath(), 'render', 'dist', 'index.html')
  : 'http://localhost:5173'

export const logPath = app.isPackaged
  ? path.resolve(app.getAppPath(), '../../logs', 'info.log')
  : path.resolve(app.getAppPath(), 'resources', 'logs', 'info.log')

export const iconsPath = app.isPackaged
  ? path.resolve(app.getAppPath(), '../../icons')
  : path.resolve(app.getAppPath(), 'resources', 'icons')

export const msgIconPath = app.isPackaged
  ? path.resolve(app.getAppPath(), '../../blivemonitor.ico')
  : path.join(__dirname, '../../blivemonitor.ico')

export default () => logger.info({ renderPath, logPath, iconsPath, msgIconPath })
