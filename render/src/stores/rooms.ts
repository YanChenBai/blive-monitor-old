import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Room {
  room_id: number
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
