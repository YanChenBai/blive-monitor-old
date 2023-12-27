import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  winCount: () => ipcRenderer.invoke('main:winCount'),
  ipcRenderer: {
    send: ipcRenderer.send,
    on: (channel: string, call: (data: any) => void) =>
      ipcRenderer.on(channel, (_e, data) => call(data))
  }
})
