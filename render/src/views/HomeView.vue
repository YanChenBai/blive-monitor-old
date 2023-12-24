<template>
  <div p-10px flex flex-col>
    <n-space w-full>
      <n-input w-full type="info" v-model:value="id" />
      <n-button type="info" @click="add()">添加</n-button>
      <n-button type="info" @click="openBili()">B站主页</n-button>
    </n-space>
    <div m-t-10px of-hidden style="height: calc(100vh - 96px)">
      <n-scrollbar>
        <n-card v-for="(item, index) in rooms" :key="index" :bordered="false" m-b-10px>
          <n-thing>
            <template #avatar>
              <n-avatar :size="48" :src="item.face" />
            </template>
            <template #header>
              <n-text>{{ item.name }}</n-text>
            </template>
            <template #description>
              <n-text>{{ item.room_id }}</n-text>
            </template>
            <template #header-extra>
              <n-space>
                <n-button size="small" @click="openLive(item)">打开</n-button>
                <n-button size="small" type="error" @click="remove(index)">删除</n-button>
              </n-space>
            </template>
          </n-thing>
        </n-card>
      </n-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Room, useRoomsStore } from '@/stores/rooms'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { events } from '@/utils/events'

defineOptions({ name: 'HomeView' })

const { rooms } = storeToRefs(useRoomsStore())
const id = ref<number | null>(null)

function add() {
  window.electron.ipcRenderer.send('main:getRoomInfo', id.value)
}

function remove(index: number) {
  rooms.value.splice(index, 1)
}

function openLive(room: Room) {
  window.electron.ipcRenderer.send('main:openLive', { ...room })
}

function openBili() {
  window.electron.ipcRenderer.send('main:openBili')
}

window.electron.ipcRenderer.on('main:getRoomInfo', (data: Room) => {
  rooms.value.push(data)
})

// 注册关闭按钮事件
events.push(() => {
  window.electron.ipcRenderer.send('main:close')
})
</script>

<style scoped></style>
