function isNotEmpty<T>(data: T | undefined | null) {
  if (data !== null && data !== undefined) {
    return data
  } else {
    return null
  }
}

export function awaitThing<T>(func: () => T | undefined | null) {
  return new Promise<T>((res, rej) => {
    const data = isNotEmpty(func())
    if (data) {
      res(data)
    } else {
      const timer = setInterval(() => {
        const data = isNotEmpty(func())
        if (data) {
          clearInterval(timer)
          res(data)
        }
      }, 100)

      setTimeout(() => {
        clearInterval(timer)
        rej(new Error('awaitThing timeout'))
      }, 10000)
    }
  })
}

/** 等待livePlayer */
export const awaitLivePlayer = () => awaitThing(() => window.livePlayer)

/** 等待video节点挂载 */
export const awaitVideoEl = () =>
  awaitThing(() => (window.livePlayer ? window.livePlayer.getVideoEl() : null))
