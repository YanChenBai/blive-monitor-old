/// <reference types="vite/client" />
import type { UpdateInfo } from 'electron-updater'
import type { Room } from './src/stores/rooms'

declare module 'vue-router' {
  import { RouteMeta } from 'vue-router'
  interface RouteMeta {}
}

declare global {
  interface Window {
    blive: {
      /** 除了主窗口外的窗口数量 */
      winCount: () => Promise<number>
      /** 获取当前版本 */
      getVersion: () => Promise<string>
      /** 检查更新 */
      checkUpdate: () => Promise<UpdateInfo>
      /** 下载更新 */
      downloadUpdate: () => Promise<string[]>
      /** 退出并安装 */
      quitAndInstall: () => Promise<void>
      /** 是否已下载 */
      isDownloaded: () => PromiseM<boolean>
      /** 是否有跟新 */
      isUpdateAvailable: () => PromiseM<boolean>
      /**
       * 获取直播间和主播数据
       * @param room_id 房间号
       * @returns
       */
      getRoomInfo: (room_id: string) => Promise<Room>
      /** ipc通讯 */
      ipcRenderer: {
        /** 发送 */
        send(chanel: string, ...args: any[]): void
        /** 监听事件 */
        on(channel: string, call: (data: any) => void): void
      }
    }
  }
}
