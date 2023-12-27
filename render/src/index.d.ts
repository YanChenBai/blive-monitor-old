declare interface Window {
  electron: {
    winCount: () => Promise<number>
    getVersion: () => Promise<string>
    getRoomInfo: (room_id: string) => Promise<{
      uid: string
      room_id: string
      short_id: string
      name: string
      face: string
      live_status: number
      tags: string
      title: string
      medal_name: string
    }>
    ipcRenderer: {
      send(channel: string, ...args: any[]): void
      on(channel: string, call: (data: any) => void): void
    }
  }
}
