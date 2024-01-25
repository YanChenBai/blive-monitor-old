import { awaitLivePlayer, awaitVideoEl } from './livePlayer'

window.onload = async () => {
  document.body.classList.add('hide-aside-area')

  // 等待liveplayer和video el 加载完成
  const [livePlayer, videoEl] = await Promise.all([awaitLivePlayer(), awaitVideoEl()])

  // 关闭弹幕侧边栏
  livePlayer.setFullscreenStatus(1)
}
