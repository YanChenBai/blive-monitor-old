import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Room } from './rooms'

export const useSelectStore = defineStore('select', () => {
  const selectRooms = ref<Room[]>([])

  return {
    selectRooms
  }
})
