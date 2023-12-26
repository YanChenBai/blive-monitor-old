<template>
  <div p-10px flex flex-col>
    <n-space w-full align="center">
      <n-input-group>
        <n-input w-full type="primary" v-model:value="id" placeholder="输入房间号👌" />
        <n-button type="primary" @click="add()">添加</n-button>
      </n-input-group>

      <n-button type="primary" @click="openBili()">登录</n-button>
      <n-select
        w-126px
        text-center
        v-model:value="model"
        :options="[
          { label: '🤔 模式 1 ', value: 0 },
          { label: '😜 模式 2 ', value: 1 }
        ]"
      />
    </n-space>
    <div m-t-10px of-hidden style="height: calc(100vh - 96px)">
      <n-scrollbar>
        <n-card v-for="(item, index) in rooms" :key="index" :bordered="false" size="small" m-b-10px>
          <n-thing>
            <template #avatar>
              <n-avatar :size="48" :src="item.face" />
            </template>
            <template #header>
              <n-text type="primary">{{ item.name }}</n-text>
            </template>
            <template #description>
              <n-text text-14px>{{ item.room_id }}</n-text>
            </template>
            <template #header-extra>
              <n-space>
                <n-button round size="small" type="primary" @click="openLive(item)">打开</n-button>

                <n-popconfirm @positive-click="remove(index)">
                  <template #trigger>
                    <n-button circle size="small" type="error">
                      <n-icon size="16"> <MaterialSymbolsDeleteRounded /> </n-icon>
                    </n-button>
                  </template>
                  一切都将一去杳然，任何人都无法将其捕获。
                </n-popconfirm>
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
import MaterialSymbolsDeleteRounded from '@/components/Icons/MaterialSymbolsDeleteRounded.vue'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { closeEvents, minEvents } from '@/utils/events'

defineOptions({ name: 'HomeView' })

const { rooms } = storeToRefs(useRoomsStore())
const id = ref<number | null>(null)
const model = ref(0)

function add() {
  window.electron.ipcRenderer.send('main:getRoomInfo', id.value)
}

function remove(index: number) {
  rooms.value.splice(index, 1)
}

function openLive(room: Room) {
  window.electron.ipcRenderer.send('main:openLive', { ...room, model: model.value === 1 })
}

function openBili() {
  window.electron.ipcRenderer.send('main:openBili')
}

window.electron.ipcRenderer.on('main:getRoomInfo', (data: Room) => {
  rooms.value.push(data)
})

// 注册关闭按钮事件
closeEvents.push(() => {
  window.electron.ipcRenderer.send('main:close')
})

// 注册最小化按钮事件
minEvents.push(() => {
  window.electron.ipcRenderer.send('main:min')
})
</script>

<style scoped></style>
