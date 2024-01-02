export function awaitThing(func: () => boolean) {
  return new Promise<void>((res) => {
    const timer = setInterval(() => {
      if (func()) {
        clearInterval(timer)
        res()
      }
    }, 50)
  })
}

/** 等待livePlayer */
export const awaitLivePlayer = () =>
  awaitThing(() => window.livePlayer !== null && window.livePlayer !== undefined)

export const awaitVideoEl = () =>
  awaitThing(() =>
    window.livePlayer
      ? window.livePlayer.getVideoEl() !== null && window.livePlayer.getVideoEl() !== undefined
      : false
  )
