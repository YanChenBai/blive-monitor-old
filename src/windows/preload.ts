import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: ipcRenderer.send,
    on: (channel: string, call: (data: any) => void) =>
      ipcRenderer.on(channel, (e, data) => call(data))
  }
})
