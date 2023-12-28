<template>
  <n-config-provider
    abstract
    :theme="darkTheme"
    :theme-overrides="{
      common: {
        primaryColor: '#fb7299FF',
        primaryColorHover: '#F288A6FF',
        primaryColorPressed: '#EE7396FF'
      },
      Input: {
        borderHover: '2px solid #F288A6FF',
        borderDisabled: '2px solid #00000',
        borderFocus: '2px solid #F288A6FF'
      }
    }"
  >
    <n-notification-provider>
      <n-dialog-provider>
        <n-message-provider placement="bottom-right">
          <div h-screen w-screen flex flex-col>
            <WinMenu @close="close" @min="min" />
            <n-layout flex-1>
              <RouterView />
            </n-layout>
          </div>
        </n-message-provider>
      </n-dialog-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { RouterView } from 'vue-router'
import WinMenu from './components/WinMenu.vue'
import { closeEvents, minEvents } from '@/utils/events'

function close() {
  closeEvents.forEach((event) => event())
}

function min() {
  minEvents.forEach((event) => event())
}
</script>

<style scoped></style>
<style>
* {
  padding: 0;
  margin: 0;
}
body {
  overflow: hidden;
}
</style>
