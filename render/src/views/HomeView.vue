<template>
  <div p-10px flex flex-col>
    <div flex w-full align="center">
      <n-input-group>
        <n-input
          w-full
          type="primary"
          v-model:value="keyword"
          placeholder="输入房间号👌"
          clearable
        />
        <n-button type="primary" @click="add()">添加</n-button>
      </n-input-group>
      <n-button type="primary" m-l-6px @click="openBili()">登录</n-button>
      <n-button type="primary" m-l-6px m-r-6px @click="refresh()" :loading="refreshLoading">
        <template #icon>
          <n-icon>
            <MaterialSymbolsSyncRounded />
          </n-icon>
        </template>
      </n-button>
      <Updater />
    </div>

    <n-spin description="加载中" :show="newVersionInit">
      <div m-t-10px of-hidden>
        <div p="2px" m-b-10px flex v-if="selectRooms.length > 0">
          <n-button-group>
            <n-button type="primary" size="small" h-26px @click="openComposeRoom"
              >打开组合 ({{ selectRooms.length }})</n-button
            >
            <n-button secondary size="small" h-26px @click="clearSlectRooms">清空</n-button>
          </n-button-group>
        </div>
        <n-scrollbar
          :class="[selectRooms.length > 0 ? 'h-[calc(100vh-96px-40px)]' : 'h-[calc(100vh-96px)]']"
        >
          <n-card
            v-for="(item, index) in searchList"
            :key="index"
            :bordered="false"
            size="small"
            class="[&:not(:last-child)]:m-b-10px"
          >
            <RoomListItem :room="item" @open="openRoom" @remove="remove"></RoomListItem>
          </n-card>
        </n-scrollbar>
      </div>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { type Room, useRoomsStore, ResultMesg } from '@/stores/rooms'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { closeEvents, minEvents } from '@/utils/events'
import { match } from 'pinyin-pro'
import { useMessage } from 'naive-ui'
import { loadingWrapRef } from '@/utils/loadingWrap'
import Updater from '@/components/Updater.vue'
import RoomListItem from '@/components/RoomListItem.vue'
import { useSelectStore } from '@/stores/select'

defineOptions({ name: 'HomeView' })

const message = useMessage()
const roomsStore = useRoomsStore()
const { selectRooms } = storeToRefs(useSelectStore())
const { rooms } = storeToRefs(roomsStore)
const keyword = ref<string>('')
const newVersionInit = ref(false)
const refreshLoading = ref(false)

async function add() {
  const status = await roomsStore.add(keyword.value)
  switch (status) {
    case ResultMesg.OK:
      message.success('添加成功')
      break
    case ResultMesg.Empty:
      message.error('房间号不能为空')
      break
    case ResultMesg.Format:
      message.error('房间号格式不正确')
      break
    case ResultMesg.Repeat:
      message.error('直播间已添加噜')
      break
  }
}

function remove(room_id: string) {
  const status = roomsStore.remove(room_id)
  switch (status) {
    case ResultMesg.OK:
      message.success('删除成功')
      break
    case ResultMesg.NotFound:
      message.error('列表里没这个房间捏')
      break
  }
}

const refresh = () =>
  loadingWrapRef(refreshLoading, async () => {
    return await roomsStore.refresh().then((res) => {
      if (res === ResultMesg.OK) {
        message.success('刷新成功')
      } else {
        message.error('刷新失败')
      }
      return res
    })
  })

const openRoom = (room: Room) => window.blive.ipcRenderer.send('main:openRoom', { ...room })
const openBili = () => window.blive.ipcRenderer.send('main:openBili')
const openComposeRoom = () => {
  if (selectRooms.value.length < 2) {
    message.error('至少选择两个直播间')
  } else {
    window.blive.openComposeRoom(selectRooms.value.map((item) => ({ ...item })))
  }
}
const clearSlectRooms = () => (selectRooms.value = [])

const livePreRegex = /^live /
// 搜索
const searchList = computed(() => {
  if (keyword.value.length <= 0) return rooms.value
  else {
    let val = keyword.value.toLowerCase()
    let searchRooms: Room[] = rooms.value
    // 如果是live开头的
    if (val.startsWith('live')) {
      // 先过滤掉为开播的
      searchRooms = searchRooms.filter((item) => item.live_status === 1)
      // 如果关键字就是live就直接返回
      if (val === 'live') return searchRooms
      val = val.replace(livePreRegex, '')
    }

    return searchRooms.filter((item) => {
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
  window.blive.ipcRenderer.send('main:close')
})

// 注册最小化按钮事件
minEvents.push(() => {
  window.blive.ipcRenderer.send('main:min')
})

onMounted(() => {
  refresh()
})
</script>

<style scoped></style>
