<template>
  <div absolute h-40px z-99 drag v-show="!showMenuState" class="drag-box"></div>
  <BiliPlayer v-if="room_id" :room_id="room_id" :quality="1" />
</template>

<script setup lang="ts">
import BiliPlayer from '@/components/BiliPlayer.vue'
import { useRoute } from 'vue-router'
import { closeEvents, minEvents } from '@/utils/events'
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
closeEvents.push(() => {
  if (win_id) {
    window.electron.ipcRenderer.send(`close:${win_id}`)
  }
})

/**  注册最小化按钮事件 */
minEvents.push(() => {
  if (win_id) {
    window.electron.ipcRenderer.send(`min:${win_id}`)
  }
})
</script>

<style scoped>
.drag-box {
  width: calc(100vw - 40px);
}
</style>
