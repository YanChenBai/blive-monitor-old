<template>
  <n-button type="primary" quaternary @click="show = true"> 版本 </n-button>

  <n-modal v-model:show="show">
    <n-card
      w-400px
      title="版本"
      :bordered="false"
      size="small"
      role="dialog"
      aria-modal="true"
      closable
      @close="show = false"
    >
      <n-spin :show="loading.version">
        <n-text>
          当前版本:
          <template v-if="version"> v{{ version }} </template>
        </n-text>
        <div w-full m-t-6px>
          <template v-if="updateInfo">
            <n-button v-if="downloadState === 0" w-full type="primary" @click="downloadUpdate"
              >下载更新</n-button
            >
            <n-progress :percentage="percentage" v-else-if="downloadState === 1"></n-progress>

            <n-button v-else w-full type="primary" @click="quitAndInstall">退出并安装</n-button>
          </template>
          <n-button v-else w-full type="primary" :loading="loading.checkUpdate" @click="checkUpdate"
            >检查更新</n-button
          >
        </div>
        <div m-t-10px v-if="updateInfo">
          <n-text type="primary">更新日志 v{{ updateInfo.version }}</n-text>
          <n-scrollbar h-300px>
            <div v-html="updateInfo.releaseNotes"></div>
          </n-scrollbar>
        </div>
      </n-spin>
    </n-card>
  </n-modal>
</template>
<script setup lang="ts">
import { loadingWrap } from '@/utils/loadingWrap'
import type { ProgressInfo } from 'electron-updater'
import type { UpdateInfo } from 'electron-updater'
import { useMessage } from 'naive-ui'
import { reactive, ref } from 'vue'

defineOptions({ name: 'Updater' })

const message = useMessage()
const show = ref(false)
const downloadState = ref(0) // 0可以下载, 1正在下载 , 2完成可安装
const percentage = ref(0)
const loading = reactive({
  version: true,
  checkUpdate: false
})
const version = ref<string | undefined>()
const updateInfo = ref<UpdateInfo | undefined>()

const checkUpdate = () =>
  loadingWrap(loading, 'checkUpdate', async () => {
    try {
      const res = await window.blive.checkUpdate()
      console.log(res)
      if (!res) message.success('当前已是最新版本!')
      else {
        updateInfo.value = res.updateInfo
      }
      return res
    } catch (error) {
      console.error(error)
    }
  })

async function downloadUpdate() {
  downloadState.value = 1
  try {
    window.blive.ipcRenderer.on('update:downloaded', () => {
      downloadState.value = 2
    })
    window.blive.ipcRenderer.on('update:downloadProgress', (event: ProgressInfo) => {
      percentage.value = Number(event.percent.toFixed(2))
    })
    await window.blive.downloadUpdate()
  } catch (error) {
    downloadState.value = 0
  }
}

function quitAndInstall() {
  window.blive.quitAndInstall()
}

loadingWrap(loading, 'version', () =>
  window.blive.getVersion().then((res) => {
    version.value = res
    return res
  })
)
checkUpdate()
</script>

<style scoped>
:deep(.releaseNotes ul) {
  padding-left: 10px;
}
</style>
