// interface PlayerOptions {
//   cid: number
//   rnd: number
//   roomInitDataV2?: {}
//   UI?: {}
// }

// class Player {
//   constructor(el: HTMLDivElement, options: PlayerOptions)
// }
// Player: new (el: HTMLDivElement, options: PlayerOptions) => Player

declare interface Window {
  electron: {
    ipcRenderer: {
      send(channel: string, ...args: any[]): void
      on(channel: string, call: (data: any) => void): void
    }
  }
}
