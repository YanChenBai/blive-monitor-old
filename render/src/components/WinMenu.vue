<template>
  <div flex h-32px w-full class="menu" v-show="showMenuState">
    <div w-full flex items-center p-l-6px drag>
      <n-text type="primary">{{ title }}</n-text>
    </div>
    <div right-0 no-drag m-4px>
      <n-button-group ref="menuBtnsRef">
        <n-button size="tiny" type="primary" tertiary @click="foldMneu" v-if="showFoldBtn"
          >折叠</n-button
        >
        <n-button size="tiny" type="primary" tertiary @click="$emit('min')">最小</n-button>
        <n-button size="tiny" type="primary" tertiary @click="$emit('close')"> 关闭 </n-button>
      </n-button-group>
    </div>
  </div>
  <div absolute top-4px right-4px z9999 v-show="!showMenuState" no-drag>
    <n-button size="tiny" type="primary" v-show="expandBtnState" @click="expandMenu">展开</n-button>
  </div>
</template>

<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoomsStore } from '@/stores/rooms'

defineOptions({ name: 'WinMenu' })

defineEmits<{
  (e: 'close'): void
  (e: 'min'): void
}>()

const { showMenuState, showFoldBtn } = storeToRefs(useRoomsStore())
const title = useTitle()
const expandBtnState = ref(false)

function foldMneu() {
  showMenuState.value = false
  showExpandBtn()
}

function expandMenu() {
  showMenuState.value = true
}

let expandBtnTimer: number
function showExpandBtn() {
  clearTimeout(expandBtnTimer)
  expandBtnState.value = true
  expandBtnTimer = window.setTimeout(() => (expandBtnState.value = false), 5000)
}

// 监听鼠标移动事件，显示展开按钮
document.addEventListener('mousemove', () => showExpandBtn())

defineExpose({ showMenuState })
</script>

<style scoped>
.menu {
  background: #1d1d1d;
}
</style>
