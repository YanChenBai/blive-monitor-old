import { createControlBar } from './assets/controlBar'
import { createChangeVolume } from './assets/changeVolume'
import { createUaerInfo } from './assets/userInfo'
import { awaitLivePlayer, awaitVideoEl } from './assets/livePlayer'
import { clearPlayerLog } from './assets/clearPlayerLog'
import { createEmojiPopover } from './assets/emotIcons'
import { win_id } from './assets/getWinId'
import { Room } from '../../types/bili'
import { ipcRenderer } from 'electron'
import { randomMouseMove } from './assets/randomMouseMove'
import { getAspectRatio } from './assets/getAspectRatio'

// 清除日志显示的持久化
clearPlayerLog()

window.onload = async () => {
  awaitLivePlayer().then((livePlayer) => {
    // 启用网页全屏
    livePlayer.setFullscreenStatus(1)

    // 等待videoEl对象挂载, 进行声音自动播放操作
    awaitVideoEl().then(async (el) => {
      el.muted = false
      const info = livePlayer.getPlayerInfo()

      // 开启声音
      if (info.volume.disabled) info.volume.disabled = false

      // 滚动音量
      createChangeVolume(livePlayer)

      // 获取截屏计算画面比例
      const aspectRatio = await getAspectRatio(livePlayer.capturePic())
      // 设置比例
      await ipcRenderer.invoke(`setAspectRatio:${win_id}`, aspectRatio)
    })
  })

  // 关闭弹幕侧边栏
  document.body.classList.add('hide-aside-area')

  const room = (await ipcRenderer.invoke(`getRoomData:${win_id}`)) as Room

  const { userInfoIsOpen } = createUaerInfo(room)
  createControlBar(room, userInfoIsOpen).then(({ inputWrap }) => {
    createEmojiPopover(inputWrap, room.room_id)
  })

  // 5分钟随机触发鼠标移动事件
  setInterval(() => randomMouseMove(), 1000 * 60 * 5)
}
