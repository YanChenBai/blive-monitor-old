import { createControlBar } from './assets/controlBar'
import { createChangeVolume } from './assets/changeVolume'
import { createUaerInfo } from './assets/userInfo'
import { awaitLivePlayer, awaitVideoEl } from './assets/livePlayer'
import { clearPlayerLog } from './assets/clearPlayerLog'

// 清除日志显示的持久化
clearPlayerLog()

window.onload = () => {
  // 等待livePlayer对象挂载
  awaitLivePlayer().then(() => {
    // 启用网页全屏
    window.livePlayer?.setFullscreenStatus(1)
  })

  // 等待videoEl对象挂载, 进行声音自动播放操作
  awaitVideoEl().then(() => {
    const videoEl = window.livePlayer!.getVideoEl() as HTMLVideoElement
    videoEl.muted = false
    const info = window.livePlayer?.getPlayerInfo()
    if (info?.volume.disabled) {
      info.volume.disabled = false
    }
  })

  // 关闭弹幕侧边栏
  document.body.classList.add('hide-aside-area')
  createChangeVolume()
  createUaerInfo()
  createControlBar()
}
