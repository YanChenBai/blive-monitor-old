<template>
  <div h-full w-full>
    <webview
      h-full
      w-full
      :src="`https://www.bilibili.com/blackboard/live/live-activity-player.html?cid=${room_id}&quality=${quality}`"
    ></webview>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'BiliPlayer' })
defineProps<{
  room_id: number | string
  quality: number | string
}>()
</script>

<style scoped lang="scss"></style>
