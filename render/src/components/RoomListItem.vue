<template>
  <n-thing>
    <template #avatar>
      <n-popover trigger="hover" placement="right" :show-arrow="false">
        <template #trigger>
          <n-badge :value="room.live_status === 1 ? '播' : ''">
            <n-avatar :size="48" :src="room.face" cursor-pointer />
          </n-badge>
        </template>
        <div>
          <div
            :class="{
              'm-b-6px': room.keyframe
            }"
            font="600"
          >
            {{ room.title }}
          </div>
          <div v-if="room.keyframe">
            <img max="w-260px h-260px" rd-4px :src="room.keyframe" />
          </div>
        </div>
      </n-popover>
    </template>
    <template #header>
      <n-text type="primary">{{ room.name }}</n-text>
    </template>
    <template #description>
      <n-text text-14px>
        <template v-if="room.short_id && room.short_id !== '0'">
          {{ room.short_id }}
        </template>
        <template v-else>
          {{ room.room_id }}
        </template>
      </n-text>
    </template>
    <template #header-extra>
      <n-space>
        <n-button
          round
          size="small"
          :ghost="roomIndex === -1"
          color="#fb8dac"
          :focusable="false"
          @click="select"
        >
          选择
          <template v-if="roomIndex !== -1">{{ roomIndex + 1 }}</template>
        </n-button>
        <n-button round size="small" type="primary" @click="$emit('open', room)">打开</n-button>
        <n-popconfirm
          @positive-click="$emit('remove', room.room_id)"
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
</template>

<script setup lang="ts">
import { type Room } from '@/stores/rooms'
import { useSelectStore } from '@/stores/select'
import { useMessage } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
defineOptions({ name: 'RoomListroom' })
const { selectRooms } = storeToRefs(useSelectStore())
const message = useMessage()

const props = defineProps<{
  room: Room
}>()
defineEmits<{
  (e: 'remove', roomId: string): void
  (e: 'open', room: Room): void
}>()
const roomIndex = computed(() =>
  selectRooms.value.findIndex((room) => room.room_id === props.room.room_id)
)
function select() {
  const index = selectRooms.value.findIndex((room) => room.room_id === props.room.room_id)
  if (index !== -1) {
    selectRooms.value.splice(index, 1)
  } else {
    if (selectRooms.value.length > 3) {
      message.error('最多只能选择4个房间')
    } else {
      selectRooms.value.push(props.room)
    }
  }
}
</script>

<style scoped></style>
