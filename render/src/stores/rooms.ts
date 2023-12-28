import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Room {
  uid: string // 账号id
  room_id: string // 房间id
  short_id: string // 房间短号, 没有时为0
  name: string // 主播名字
  face: string // 头像
  live_status: number // 直播状态, 0 下播, 1 直播, 2 轮播
  tags: string // 主播的标签
  title: string // 直播标题
  medal_name: string // 粉丝牌名字
}

export const useRoomsStore = defineStore(
  'rooms',
  () => {
    const rooms = ref<Room[]>([])
    return { rooms }
  },
  {
    persist: {
      paths: ['rooms']
    }
  }
)
