import { ipcRenderer } from 'electron'

/** 等待livePlayer */
async function awaitLivePlayer() {
  return new Promise<void>((res) => {
    const timer = setInterval(() => {
      if (window.livePlayer) {
        clearInterval(timer)
        res()
      }
    }, 50)
  })
}

/** 发送弹幕 */
function sendDanmu(msg: string) {
  if (msg.length <= 0) {
    return
  }
  const textarea = document.querySelector(
    '#control-panel-ctnr-box > div.chat-input-ctnr.p-relative > div:nth-child(2) > textarea'
  ) as HTMLTextAreaElement
  const btn = document.querySelector(
    '.control-panel-ctnr .chat-input-ctnr ~ .bottom-actions .bl-button--primary'
  ) as HTMLButtonElement

  /** 创建一个输入事件 */
  const inputEvent = new Event('input', {
    bubbles: true,
    cancelable: true
  })
  textarea.value = msg

  /** 触发输入事件 */
  textarea.dispatchEvent(inputEvent)

  /** 触发发送按钮 */
  btn.click()
}

/** 创建输入框 */
async function createDanmuInput() {
  // 获取html元素
  const inputHtml = `
<div class='btns close'>
  <div class='close-win'>
    <button class='btn'>关</button>
  </div>
  <div class='input-switch'>
    <button class='btn'>弹</button>
  </div>
  <div class='min-win'>
    <button class='btn'>小</button>
  </div>
  <div class='top-win'>
    <button class='btn top'>顶</button>
  </div>
</div>
<div class='input-wrap close'>
  <input type='text' placeholder='发个弹幕呗~' maxlength='20' />
  <div class='length'><span class='value'>0</span>/20</div>
</div>

  `

  // 创建元素
  const wrap = document.createElement('div')

  wrap.innerHTML = inputHtml

  /** 添加弹幕输入框 */
  document.body.appendChild(wrap)

  let inputStatus = false
  let btnStatus = false

  const btnsWrap = document.querySelector('.btns') as HTMLDivElement
  const closeBtn = document.querySelector('.close-win>button') as HTMLButtonElement
  const minBtn = document.querySelector('.min-win>button') as HTMLButtonElement
  const topBtn = document.querySelector('.top-win>button') as HTMLButtonElement
  const btn = document.querySelector('.input-switch>button') as HTMLButtonElement
  const inputWrap = document.querySelector('.input-wrap') as HTMLDivElement
  const input = document.querySelector('.input-wrap>input') as HTMLInputElement
  const len = document.querySelector('.input-wrap>.length>.value') as HTMLDivElement

  // 更新输入框显示状态
  function changeInput(val: boolean) {
    inputStatus = val
    if (val) {
      inputWrap.classList.remove('close')
      inputWrap.classList.add('open')
      input.focus()
    } else {
      inputWrap.classList.remove('open')
      inputWrap.classList.add('close')
    }
  }

  // 更新按钮状态
  function changeBtn(val: boolean) {
    btnStatus = val

    if (val) {
      btnsWrap.classList.remove('close')
      btnsWrap.classList.add('open')
    } else {
      btnsWrap.classList.remove('open')
      btnsWrap.classList.add('close')
    }
  }

  // 监听鼠标进入窗口和离开窗口事件
  document.addEventListener('mousemove', () => {
    changeBtn(true)
  })

  document.addEventListener('mouseleave', () => {
    changeBtn(false)
  })

  const win_id = new URLSearchParams(window.location.search).get('win_id')
  // 关闭窗口
  closeBtn.addEventListener('click', () => ipcRenderer.send(`close:${win_id}`))

  // 最小化窗口
  minBtn.addEventListener('click', () => ipcRenderer.send(`min:${win_id}`))

  // 切换显示
  btn.addEventListener('click', () => changeInput(!inputStatus))

  // 更新字符数
  input.addEventListener('input', () => (len.innerText = input.value.length.toString()))

  // 监听回车发送
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (inputStatus) {
        // 发送
        sendDanmu(input.value.trim())
        // 清空
        input.value = ''
        len.innerText = '0'
        changeInput(false)
      } else {
        changeBtn(true)
        changeInput(true)
      }
    }

    if (e.key === 'Escape') {
      changeInput(false)
      changeBtn(false)
    }
  })

  function changeTop(is: boolean) {
    if (is) {
      topBtn.classList.remove('def')
      topBtn.classList.add('top')
    } else {
      topBtn.classList.remove('top')
      topBtn.classList.add('def')
    }
  }

  // 初始化
  changeTop(await ipcRenderer.invoke(`isAlwaysOnTop:${win_id}`))
  // 监听置顶
  topBtn.addEventListener('click', async () => {
    const is = await ipcRenderer.invoke(`isAlwaysOnTop:${win_id}`)
    ipcRenderer.invoke(`setAlwaysOnTop:${win_id}`, !is)
    changeTop(!is)
  })
}

/** 清除弹窗 */
function clearPopover() {
  setTimeout(() => clearInterval(timer), 10000)
  const timer = setInterval(() => {
    document.querySelectorAll('.shop-popover').forEach((item) => {
      clearInterval(timer)
      ;(item as HTMLDivElement).style.display = 'none'
    })
  }, 100)
}

/** 音量修改 */
let changeVolumeTimet: NodeJS.Timeout
function changeVolume() {
  const html = `
  <div class="change-volume" style="display: none;">
    <span class="value">0</span>%
  </div>
  `
  const dom = document.createElement('div')
  dom.innerHTML = html
  document.body.appendChild(dom)

  window.addEventListener('wheel', (event) => {
    if (!window.livePlayer) return

    const volumeValueEl = document.querySelector('.change-volume>.value') as HTMLSpanElement
    const volumeEl = document.querySelector('.change-volume') as HTMLDivElement

    volumeEl.style.display = 'block'
    if (changeVolumeTimet) clearTimeout(changeVolumeTimet)

    const info = window.livePlayer.getPlayerInfo()
    const volume = info.volume.value
    const volumeStep = 2

    let changeVlaue =
      event.deltaY > 0 ? Math.max(0, volume - volumeStep) : Math.min(100, volume + volumeStep)

    changeVlaue = Number(changeVlaue.toFixed(0))
    window.livePlayer.volume(changeVlaue)
    volumeValueEl.innerText = changeVlaue.toString()

    changeVolumeTimet = setTimeout(() => {
      volumeEl.style.display = 'none'
    }, 500)
  })
}

/** 匹配可输入的最大弹幕 */
function matchMaxDanmu() {
  const regex = /0\/(\d+)/
  return new Promise<number>((res) => {
    const timer = setInterval(() => {
      const dom = document.querySelector('.input-limit-hint') as HTMLDivElement
      if (!dom) return
      const match = dom.innerText.match(regex)
      clearInterval(timer)
      return res(match ? Number(match[1]) : 20)
    }, 200)
  })
}

/** 添加头像和主播名字 */
function addFaceAndName() {
  document.querySelector('.room-owner-username')
  document.querySelector('.blive-avatar-face')
}

window.addEventListener('DOMContentLoaded', () => createDanmuInput(), { once: true })

window.onload = () => {
  // 等待livePlayer对象挂载
  awaitLivePlayer().then(() => {
    // 启用网页全屏
    window.livePlayer?.setFullscreenStatus(1)
  })

  // 关闭弹幕侧边栏
  document.body.setAttribute('class', `${document.body.getAttribute('class')} hide-aside-area`)

  clearPopover()
  changeVolume()
  matchMaxDanmu().then((res) => {
    const dom = document.querySelector('.input-wrap>input') as HTMLInputElement
    dom.maxLength = res
  })
}
