import { app } from 'electron'
import log4js from 'log4js'
import path from 'path'

const dir = app.isPackaged
  ? path.resolve(process.resourcesPath + '\\logs\\info.log')
  : 'logs/info.log'

log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: {
      type: 'dateFile',
      filename: dir,
      maxLogSize: 10485760,
      encoding: 'utf-8',
      backups: 3,
      compress: false,
      pattern: 'yyyy-MM-dd',
      alwaysIncludePattern: true,
      keepFileExt: true
    }
  },
  categories: {
    default: { appenders: ['file', 'console'], level: 'info' }
  }
})

/** 日志 */
export const logger = log4js.getLogger()
