<template>
  <n-button @click="showModal = true" type="primary" quaternary> 更多 </n-button>
  <n-modal v-model:show="showModal" w-400px>
    <n-card title="更多" :bordered="false" size="huge" role="dialog" aria-modal="true" closable>
      <n-space>
        <n-tag>版本 v0.0.4</n-tag>
      </n-space>
    </n-card>
  </n-modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'MoreModal' })
const showModal = ref(false)
</script>

<style scoped lang="scss"></style>
