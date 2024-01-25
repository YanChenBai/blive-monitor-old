import { html } from 'proper-tags'
import { createDom, ref } from './tools'
import { ipcRenderer } from 'electron'
import { win_id } from './getWinId'
import { LivePlayer } from '../../../types/livePlayer'

const dom = html`
  <div class="change-volume" style="display: none;"><span class="value">0</span>%</div>
`
const volumeStep = 2
export async function createChangeVolume(livePlayer: LivePlayer) {
  createDom(dom)

  const volumeWrap = document.querySelector('.change-volume') as HTMLDivElement
  const volumeValueEl = document.querySelector('.change-volume>.value') as HTMLSpanElement

  let changeVolumeTimet: NodeJS.Timeout

  const defVolume = ((await ipcRenderer.invoke(`getVolume:${win_id}`)) as number) || undefined

  const volumeStatus = ref(false, (value) => {
    volumeWrap.style.display = value ? 'block' : 'none'
  })

  const volumeValue = ref(defVolume || 0, (value) => (volumeValueEl.innerText = String(value)))
  livePlayer.volume(defVolume || 0)

  // 监听滚动
  window.addEventListener('wheel', async (event) => {
    const info = livePlayer.getPlayerInfo()
    if (!info.volume) return

    volumeStatus.value = true
    if (changeVolumeTimet) clearTimeout(changeVolumeTimet)

    const volume = info.volume.value

    // 看看是不是被静音
    if (event.deltaY < 0 && info.volume.disabled) {
      info.volume.disabled = false
      livePlayer.getVideoEl().muted = false
    }

    // 放置超出0 - 100的范围内
    let changeVlaue =
      event.deltaY > 0 ? Math.max(0, volume - volumeStep) : Math.min(100, volume + volumeStep)
    changeVlaue = Number(changeVlaue.toFixed(0))

    // 修改音量
    volumeValue.value = changeVlaue
    livePlayer.volume(changeVlaue)

    // 保存音量
    await ipcRenderer.invoke(`setVolume:${win_id}`, changeVlaue)

    changeVolumeTimet = setTimeout(() => (volumeStatus.value = false), 500)
  })
}
