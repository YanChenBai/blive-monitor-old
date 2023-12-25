function isLiveRoom() {
  const urlPattern = /^https:\/\/live\.bilibili\.com\/(\d+)$/
  return urlPattern.test(window.location.href)
}

async function awaitLivePlayer() {
  return new Promise<void>((res) => {
    const timer = setInterval(() => {
      if (window.livePlayer) {
        clearInterval(timer)
        res()
      }
    }, 100)
  })
}

function addCss(css: string) {
  const head = document.createElement('style')
  head.innerHTML = css
  document.head.appendChild(head)
}

function addMask(content: string) {
  const mask = document.createElement('div')
  mask.innerHTML = content
  mask.setAttribute(
    'style',
    `
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: #000000b8;
    z-index: 99999;
    opacity: 0.5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
  `
  )

  document.body.appendChild(mask)
  return mask
}

window.onload = async () => {
  // 等待livePlayer对象挂载
  await awaitLivePlayer()

  const liveStatus = window.livePlayer?.getPlayerInfo().liveStatus

  /** 去掉水印 */
  const picon = document.querySelector('.web-player-icon-roomStatus') as HTMLDivElement
  if (picon) picon.style.display = 'none'

  /** 启用网页全屏 */
  await Promise.all([window.livePlayer?.setFullscreenStatus(1)])

  document.body.style.opacity = '1'

  /** 关闭弹幕侧边栏 */
  document.body.setAttribute('class', `${document.body.getAttribute('class')} hide-aside-area`)

  /** 注入关闭礼物栏的css */
  addCss(`
    #full-screen-interactive-wrap { 
        display: none !important 
    }
    #fullscreen-danmaku-vm .fullscreen-danmaku { 
        bottom: 5px !important 
    }
    `)

  /** 添加拖拽栏 */
  const menu = document.createElement('div')
  menu.setAttribute(
    'style',
    `
    -webkit-app-region: drag;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999999;
    width: 100vw;
    height: 40px;
    `
  )
  document.body.appendChild(menu)

  /** 添加弹幕输入框 */
  const danmuInput = document.createElement('div')
  danmuInput.setAttribute(
    'style',
    `
    position: absolute;
    bottom: 40px;
    left: 10px;
    z-index: 9999;
    width: 300px;
     `
  )

  danmuInput.innerHTML = `
    <div style="height: 30px;">
      <button id="danmu-input-switch" style="display: none;line-height: 16px;">发送:开</button>
    </div>
    <div
     id="danmu-num"
     style="
      opacity: 0.6;
      width: fit-content;
      height: fit-content;
      position: absolute;
      display: flex;
      align-items: center;
      padding-left: 6px;
      right: 0;
      bottom: 10px;
      display: none;
     "
    >0/20</div>
    <input
      placeholder="请输入弹幕内容"
      id="danmu-input"
      type="text"
      maxlength="20"
      style="
      height: 30px;
      width: 100%;
      opacity: 1;
      display: none;
    " />
  `
  document.body.appendChild(danmuInput)
  const inputSwitch = document.getElementById('danmu-input-switch') as HTMLButtonElement

  document.addEventListener('mouseenter', () => {
    inputSwitch.style.display = 'block'
  })

  document.addEventListener('mouseleave', () => {
    inputSwitch.style.display = 'none'
  })

  /** 切换输入框显示状态 */
  inputSwitch.addEventListener('click', () => {
    const danmuNum = document.getElementById('danmu-num') as HTMLDivElement
    const dom = document.getElementById('danmu-input') as HTMLInputElement
    if (dom.style.display === 'none') {
      inputSwitch.innerText = '发送:关'
      danmuNum.style.display = 'block'
      dom.style.display = 'block'
    } else {
      inputSwitch.innerText = '发送:开'
      danmuNum.style.display = 'none'
      dom.style.display = 'none'
    }
  })

  const input = document.querySelector('#danmu-input') as HTMLInputElement

  /** 更新显示文本长度 */
  input.addEventListener('input', () => {
    const dom = danmuInput.querySelector('#danmu-num') as HTMLDivElement
    dom.innerText = input.value.length.toString() + '/20'
  })

  /** 发送弹幕 */
  function sendDanmu(msg: string) {
    if (msg.length <= 0) {
      console.log('请输入弹幕内容')
      return
    }
    const bliDanmuInput = document.querySelector(
      '#control-panel-ctnr-box > div.chat-input-ctnr.p-relative > div:nth-child(2) > textarea'
    ) as HTMLTextAreaElement
    const bliDanmuSendBtn = document.querySelector(
      '.control-panel-ctnr .chat-input-ctnr ~ .bottom-actions .bl-button--primary'
    ) as HTMLButtonElement

    /** 创建一个输入事件 */
    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true
    })
    bliDanmuInput.value = msg

    /** 触发输入事件 */
    bliDanmuInput.dispatchEvent(inputEvent)

    /** 触发发送按钮 */
    bliDanmuSendBtn.click()
  }

  /** 监听回车发送 */
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      /** 发送 */
      sendDanmu(input.value.trim())
      /** 清空 */
      input.value = ''
    }
  })

  /** 去掉弹窗 */
  setTimeout(() => clearInterval(timer), 10000)
  const timer = setInterval(() => {
    document.querySelectorAll('.shop-popover').forEach((item) => {
      clearInterval(timer)
      ;(item as HTMLDivElement).style.display = 'none'
    })
  }, 200)
}
