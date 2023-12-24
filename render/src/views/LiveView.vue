<template>
  <div absolute h-40px z-99 drag style="width: calc(100vw - 40px)" v-show="!showMenuState"></div>
  <BiliPlayer v-if="room_id" :room_id="room_id" :quality="1" />
</template>

<script setup lang="ts">
import BiliPlayer from '@/components/BiliPlayer.vue'
import { useRoute } from 'vue-router'
import { events } from '@/utils/events'
import { storeToRefs } from 'pinia'
import { useRoomsStore } from '@/stores/rooms'

defineOptions({ name: 'LiveView' })

const { showMenuState } = storeToRefs(useRoomsStore())
const route = useRoute()
const { win_id, room_id, name } = route.query as {
  win_id?: string
  room_id?: string
  name?: string
}

// 修改标题
if (name) document.title = name

/** 注册窗口关闭事件 */
events.push(() => {
  if (win_id) {
    window.electron.ipcRenderer.send(`close:${win_id}`)
  }
})
</script>

<style scoped></style>
