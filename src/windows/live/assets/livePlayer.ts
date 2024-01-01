/** 等待livePlayer */
export async function awaitLivePlayer() {
  return new Promise<void>((res) => {
    const timer = setInterval(() => {
      if (window.livePlayer) {
        clearInterval(timer)
        res()
      }
    }, 50)
  })
}
