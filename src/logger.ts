import log4js from 'log4js'

log4js.configure({
  appenders: {
    default: {
      type: 'dateFile',
      filename: 'logs/maho.log',
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
    default: { appenders: ['default'], level: 'debug' }
  }
})

/** 日志 */
export const logger = log4js.getLogger()
