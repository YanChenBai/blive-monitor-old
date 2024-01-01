/// <reference types="vite/client" />
import type { UpdateInfo } from 'electron-updater'
import type { Room } from './src/stores/rooms'

declare module 'vue-router' {
  import { RouteMeta } from 'vue-router'
  interface RouteMeta {}
}

interface ManyUserInfoItem {
  title: string
  room_id: number
  uid: number
  online: number
  live_time: number
  live_status: number
  short_id: number
  area: number
  area_name: string
  area_v2_id: number
  area_v2_name: string
  area_v2_parent_name: string
  area_v2_parent_id: number
  uname: string
  face: string
  tag_name: string
  tags: string
  cover_from_user: string
  keyframe: string
  lock_till: string
  hidden_till: string
  broadcast_type: number
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
      /**
       * 获取批量的直播间信息
       * @param uids 用户id数组
       * @returns
       */
      getManyRoomInfo: (uids: string[]) => Promise<Record<string, ManyUserInfoItem>>
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
