import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Room {
  uid: string
  room_id: string
  short_id: string
  name: string
  face: string
}

export const useRoomsStore = defineStore(
  'rooms',
  () => {
    const showMenuState = ref(false)
    const showFoldBtn = ref(true)
    const rooms = ref<Room[]>([])
    return { rooms, showMenuState, showFoldBtn }
  },
  {
    persist: {
      paths: ['rooms']
    }
  }
)
