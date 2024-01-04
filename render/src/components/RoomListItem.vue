<template>
  <n-thing>
    <template #avatar>
      <n-badge :value="room.live_status === 1 ? '播' : ''">
        <n-avatar :size="48" :src="room.face" />
      </n-badge>
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
defineOptions({ name: 'RoomListroom' })
defineProps<{
  room: Room
}>()
defineEmits<{
  (e: 'remove', roomId: string): void
  (e: 'open', room: Room): void
}>()
</script>

<style scoped></style>
