<template>
  <n-config-provider abstract :theme="darkTheme">
    <div h-screen w-screen flex flex-col>
      <WinMenu @close="close" />
      <n-layout flex-1>
        <RouterView />
      </n-layout>
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { RouterView } from 'vue-router'
import WinMenu from './components/WinMenu.vue'
import { events } from '@/utils/events'

function close() {
  events.forEach((event) => event())
}
</script>

<style scoped></style>
<style>
* {
  padding: 0;
  margin: 0;
}
</style>
