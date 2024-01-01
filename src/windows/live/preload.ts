import { createControlBar } from './assets/controlBar'
import { createChangeVolume } from './assets/changeVolume'
import { createUaerInfo } from './assets/userInfo'
import { awaitLivePlayer } from './assets/livePlayer'

window.onload = () => {
  // 等待livePlayer对象挂载
  awaitLivePlayer().then(() => {
    // 启用网页全屏
    window.livePlayer?.setFullscreenStatus(1)
  })

  // 关闭弹幕侧边栏
  document.body.classList.add('hide-aside-area')
  createChangeVolume()
  createUaerInfo()
  createControlBar()
}
