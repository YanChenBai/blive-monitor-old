import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  winCount: () => ipcRenderer.invoke('main:winCount'),
  getRoomInfo: (room_id: string) => ipcRenderer.invoke('main:getRoomInfo', room_id),
  getVersion: () => ipcRenderer.invoke('main:getVersion'),
  checkUpdate: () => ipcRenderer.invoke('main:checkUpdate'),
  downloadUpdate: () => ipcRenderer.invoke('main:downloadUpdate'),
  ipcRenderer: {
    send: ipcRenderer.send,
    on: (channel: string, call: (data: any) => void) =>
      ipcRenderer.on(channel, (_e, data) => call(data))
  }
})
