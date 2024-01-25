import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('blive', {
  winCount: () => ipcRenderer.invoke('main:winCount'),
  getRoomInfo: (room_id: string) => ipcRenderer.invoke('main:getRoomInfo', room_id),
  getManyRoomInfo: (uids: string[]) => ipcRenderer.invoke('main:getManyRoomInfo', uids),
  /** 获取版本 */
  getVersion: () => ipcRenderer.invoke('update:version'),
  /** 检查更新 */
  checkUpdate: () => ipcRenderer.invoke('update:check'),
  /** 下载更新 */
  downloadUpdate: () => ipcRenderer.invoke('update:download'),
  /** 退出并安装 */
  quitAndInstall: () => ipcRenderer.invoke('update:quitAndInstall'),
  /** 是否已下载 */
  isDownloaded: () => ipcRenderer.invoke('update:isDownloaded'),
  /** 是否有跟新 */
  isUpdateAvailable: () => ipcRenderer.invoke('update:isUpdateAvailable'),

  /** ipc */
  ipcRenderer: {
    send: ipcRenderer.send,
    on: (channel: string, call: (data: any) => void) =>
      ipcRenderer.on(channel, (_e, data) => call(data))
  }
})
