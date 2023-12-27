<template>
  <div p-10px flex flex-col>
    <div flex w-full align="center">
      <n-input-group>
        <n-input w-full type="primary" v-model:value="keyword" placeholder="输入房间号👌" />
        <n-button type="primary" @click="add()">添加</n-button>
      </n-input-group>
      <n-button type="primary" m-l-6px m-r-6px @click="openBili()">登录</n-button>
      <More />
    </div>

    <div m-t-10px of-hidden>
      <n-scrollbar style="height: calc(100vh - 96px)">
        <n-card
          v-for="(item, index) in searchList"
          :key="index"
          :bordered="false"
          size="small"
          class="item"
        >
          <n-thing>
            <template #avatar>
              <n-avatar :size="48" :src="item.face" />
            </template>
            <template #header>
              <n-text type="primary">{{ item.name }}</n-text>
            </template>
            <template #description>
              <n-text text-14px>
                <template v-if="item.short_id && item.short_id !== '0'">
                  {{ item.short_id }}
                </template>
                <template v-else>
                  {{ item.room_id }}
                </template>
              </n-text>
            </template>
            <template #header-extra>
              <n-space>
                <n-button round size="small" type="primary" @click="openLive(item)">打开</n-button>

                <n-popconfirm
                  @positive-click="remove(index)"
                  positive-text="尊嘟"
                  negative-text="假嘟"
                  placement="bottom"
                >
                  <template #trigger>
                    <n-button circle size="small" type="error">
                      <n-icon size="16"> <MaterialSymbolsDeleteRounded /> </n-icon>
                    </n-button>
                  </template>
                  要删噜!
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
import More from '@/components/More.vue'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { closeEvents, minEvents } from '@/utils/events'
import { match } from 'pinyin-pro'
import { useMessage } from 'naive-ui'

defineOptions({ name: 'HomeView' })

const message = useMessage()
const { rooms } = storeToRefs(useRoomsStore())
const keyword = ref<string>('')

async function add() {
  const regex = /^\d+$/
  const val = keyword.value.trim()

  if (!regex.test(val)) {
    message.error('请输入正确格式的房间号!')
    return
  }

  if (val.length <= 0) {
    message.error('请输入房间号!')
    return
  }

  const room = await window.electron.getRoomInfo(val)
  const index = rooms.value.findIndex((item) => item.room_id === room.room_id)
  room.tags = room.tags.replace(new RegExp(',', 'g'), ' ')

  if (index === -1) {
    rooms.value.push(room)
  } else {
    rooms.value[index] = room
    message.error('加过了!')
  }
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

// 搜索
const searchList = computed(() => {
  if (keyword.value.length <= 0) return rooms.value
  else {
    return rooms.value.filter((item) => {
      const val = keyword.value.toLowerCase()

      // 修改了数据结构兼容
      const room = Object.assign(
        {
          uid: '',
          room_id: '',
          short_id: '',
          name: '',
          face: '',
          live_status: 0,
          tags: '',
          title: '',
          medal_name: ''
        },
        item
      )
      return (
        room.name.toLowerCase().includes(val) ||
        room.room_id.includes(val) ||
        room.short_id.includes(val) ||
        match(room.name, val, { continuous: true }) !== null ||
        match(room.tags, val, { continuous: true }) !== null ||
        match(room.medal_name, val, { continuous: true }) !== null
      )
    })
  }
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

<style scoped>
.item:not(:last-child) {
  margin-bottom: 10px;
}
</style>
