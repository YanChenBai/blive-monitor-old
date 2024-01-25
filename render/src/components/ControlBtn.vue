<template>
  <n-popover trigger="hover" :to="false" placement="left">
    <template #trigger>
      <n-button size="small" type="primary" circle :color="color">
        <template #icon>
          <n-icon>
            <slot></slot>
          </n-icon>
        </template>
      </n-button>
    </template>
    <div w-100px text-center>{{ tips }}</div>
  </n-popover>
</template>

<script setup lang="ts">
defineOptions({ name: 'ControlBtn' })
defineProps<{
  color: string
  tips: string
}>()
</script>

<style scoped></style>
