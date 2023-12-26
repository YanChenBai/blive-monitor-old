<template>
  <div h-full w-full>
    <webview
      ref="webviewRef"
      h-full
      w-full
      :src="`https://www.bilibili.com/blackboard/live/live-activity-player.html?cid=${room_id}&quality=${quality}`"
    ></webview>
  </div>
</template>

<script setup lang="ts">
import { templateRef } from '@vueuse/core'
import { onMounted } from 'vue'

defineOptions({ name: 'BiliPlayer' })
defineProps<{
  room_id: number | string
  quality: number | string
}>()
const webviewRef = templateRef<HTMLIFrameElement & any>('webviewRef')

onMounted(() => {
  webviewRef.value.addEventListener('dom-ready', () => {
    /** 注入css */
    webviewRef.value.insertCSS(`
    #web-player-controller-wrap-el > div > div > div.right-area.svelte-4rgwwa > div.ext-nodes.svelte-4rgwwa { 
      display: none !important;
    }
    #player_container > div > div > div.web-player-icon-roomStatus {
      display: none !important;
    }
    .web-player-ending-panel-recommendList {
      display: none !important;
    }
    `)
  })
})
</script>

<style scoped lang="scss"></style>
