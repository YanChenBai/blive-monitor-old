import { createControlBar } from './assets/controlBar'
import { createChangeVolume } from './assets/changeVolume'
import { createUaerInfo } from './assets/userInfo'
import { awaitLivePlayer, awaitVideoEl } from './assets/livePlayer'
import { clearPlayerLog } from './assets/clearPlayerLog'
import { createEmojiPopover } from './assets/emotIcons'
import { win_id } from './assets/getWinId'
import { OpenRoom } from '../../types/bili'
import { ipcRenderer } from 'electron'
import { randomMouseMove } from './assets/randomMouseMove'

// 清除日志显示的持久化
clearPlayerLog()

window.onload = async () => {
  awaitLivePlayer().then((livePlayer) => {
    // 启用网页全屏
    livePlayer.setFullscreenStatus(1)

    // 等待videoEl对象挂载, 进行声音自动播放操作
    awaitVideoEl().then((el) => {
      el.muted = false
      const info = livePlayer.getPlayerInfo()
      if (info.volume.disabled) {
        info.volume.disabled = false
      }
    })
  })

  // 关闭弹幕侧边栏
  document.body.classList.add('hide-aside-area')
  createChangeVolume()

  const room = (await ipcRenderer.invoke(`getRoomData:${win_id}`)) as OpenRoom

  const { userInfoIsOpen } = createUaerInfo(room)
  createControlBar(room, userInfoIsOpen).then(({ inputWrap }) => {
    createEmojiPopover(inputWrap, room.room_id)
  })

  // 5分钟随机触发鼠标移动事件
  setInterval(() => randomMouseMove(), 1000 * 60 * 5)
}
