<template>
  <div class="plugin-wrap">
    <ControlBar />
  </div>
</template>

<script setup lang="ts">
import ControlBar from './components/ControlBar.vue'

defineOptions({ name: 'Plugin' })
</script>

<style scoped>
.plugin-wrap {
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 9999999999999999;
  top: 50vh;
  right: 0px;
  transform: translateY(-50%);
}
</style>
