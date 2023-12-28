<template>
  <n-button type="primary" quaternary @click="checkUpdate" :loading="loading"> 更新 </n-button>
</template>
<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'MoreModal' })

const loading = ref(false)
async function checkUpdate() {
  loading.value = true
  try {
    const res = await window.electron.checkUpdate()
    console.log(res)
  } catch (error) {
    console.error(error)
  }
  loading.value = false
}
</script>

<style scoped>
:deep(.releaseNotes ul) {
  padding-left: 10px;
}
</style>
