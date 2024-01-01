import { html } from 'proper-tags'
import { createDom, ref } from './tools'

const dom = html`
  <div class="change-volume" style="display: none;"><span class="value">0</span>%</div>
`

export function createChangeVolume(volumeStep = 2) {
  createDom(dom)

  const volumeWrap = document.querySelector('.change-volume') as HTMLDivElement
  const volumeValueEl = document.querySelector('.change-volume>.value') as HTMLSpanElement

  let changeVolumeTimet: NodeJS.Timeout

  const volumeStatus = ref(false, (value) => {
    volumeWrap.style.display = value ? 'block' : 'none'
  })

  const volumeValue = ref(0, (value) => {
    volumeValueEl.innerText = String(value)
  })

  // 监听滚动
  window.addEventListener('wheel', (event) => {
    if (!window.livePlayer) return

    volumeStatus.value = true
    if (changeVolumeTimet) clearTimeout(changeVolumeTimet)

    const info = window.livePlayer.getPlayerInfo()
    const volume = info.volume.value

    // 看看是不是被静音
    if (event.deltaY < 0 && info.volume.disabled) {
      info.volume.disabled = false
      window.livePlayer.getVideoEl().muted = false
    }

    // 放置超出0 - 100的范围内
    let changeVlaue =
      event.deltaY > 0 ? Math.max(0, volume - volumeStep) : Math.min(100, volume + volumeStep)
    changeVlaue = Number(changeVlaue.toFixed(0))
    window.livePlayer.volume(changeVlaue)
    volumeValue.value = changeVlaue

    changeVolumeTimet = setTimeout(() => {
      volumeStatus.value = false
    }, 500)
  })
}
