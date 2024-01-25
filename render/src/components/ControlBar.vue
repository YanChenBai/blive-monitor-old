<template>
  <div flex flex-col flex-gap-10px p-10px>
    <ControlBtn color="rgb(243, 59, 99)" tips="关闭"> <MaterialSymbolsCancel /> </ControlBtn>
    <ControlBtn color="#00aeec" tips="最小化"> <MingcuteMinimizeFill /> </ControlBtn>
    <ControlBtn color="#f288a6ff" tips="弹幕输入">
      <IcRoundMessage />
    </ControlBtn>
    <ControlBtn color="#64d496" tips="置顶"> <MingcutePinFill /> </ControlBtn>
    <ControlBtn color="#fbc94b" tips="锁定比例"> <MingcuteLockFill /> </ControlBtn>
  </div>
</template>

<script setup lang="ts">
import IcRoundMessage from '@/components/Icons/IcRoundMessage.vue'
import MaterialSymbolsCancel from '@/components/Icons/MaterialSymbolsCancel.vue'
import MingcuteMinimizeFill from '@/components/Icons/MingcuteMinimizeFill.vue'
import MingcutePinFill from '@/components/Icons/MingcutePinFill.vue'
import MingcutePin2Fill from '@/components/Icons/MingcutePin2Fill.vue'
import MingcuteLockFill from '@/components/Icons/MingcuteLockFill.vue'
import MingcuteUnlockFill from '@/components/Icons/MingcuteUnlockFill.vue'
import ControlBtn from '@/components/ControlBtn.vue'
defineOptions({ name: 'ControlBar' })
</script>

<style scoped>
.control-bar {
}
</style>
