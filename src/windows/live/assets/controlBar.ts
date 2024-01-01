import { html } from 'proper-tags'
import { createDom, ref } from './tools'
import { ipcRenderer } from 'electron'
import { win_id } from './getWinId'
import { OpenRoom } from '../../../types/bili'

type Btn = {
  name: string
  value: string
  class: string
}

const btns: Btn[] = [
  {
    name: 'close-win',
    value: '关',
    class: ''
  },
  {
    name: 'input-switch',
    value: '弹',
    class: ''
  },
  {
    name: 'min-win',
    value: '小',
    class: ''
  },
  {
    name: 'top-win',
    value: '顶',
    class: 'top'
  }
]

/**
 * 获取btn
 * @param item
 */
const getBtn = (item: Btn) =>
  html`
    <div class="${item.name}">
      <button class="btn ${item.class}">${item.value}</button>
    </div>
  `

// 模板
const template = html`
  <div class="control-bar close">${btns.map((item) => getBtn(item))}</div>
  <div class="input-wrap close">
    <input type="text" placeholder="发个弹幕呗~" maxlength="20" />
    <div class="length"><span class="value">0</span>/<span class="maxlength">20</span></div>
  </div>
`

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

/** 发送弹幕
 * @param msg 消息
 */
function sendDanmu(msg: string) {
  console.log(msg)

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

/** 关闭窗口 */
function closeBtn() {
  const closeBtn = document.querySelector('.close-win>button') as HTMLButtonElement
  closeBtn.addEventListener('click', () => ipcRenderer.send(`close:${win_id}`))
}

/** 最小化 */
function minBtn() {
  const minBtn = document.querySelector('.min-win>button') as HTMLButtonElement // 最小化窗口
  minBtn.addEventListener('click', () => ipcRenderer.send(`min:${win_id}`))
}

const getIstop = (room_id: string) => window.localStorage.getItem(`isTop:${room_id}`)
const addIstop = (room_id: string) => window.localStorage.setItem(`isTop:${room_id}`, 'o')
const removeIstop = (room_id: string) => window.localStorage.removeItem(`isTop:${room_id}`)

ipcRenderer.invoke(`setAlwaysOnTop:${win_id}`, getIstop('732') ? true : false)
/** 置顶 */
async function topBtn() {
  const { room_id } = (await ipcRenderer.invoke(`getRoomData:${win_id}`)) as OpenRoom
  const topBtn = document.querySelector('.top-win>button') as HTMLButtonElement
  const isTopStorage = getIstop(room_id)
  const isTop = ref(
    isTopStorage ? true : false,
    (value) => {
      topBtn.classList.toggle('top', value)
      value ? addIstop(room_id) : removeIstop(room_id)
      ipcRenderer.invoke(`setAlwaysOnTop:${win_id}`, value)
    },
    true
  )

  // 初始化
  isTop.value = await ipcRenderer.invoke(`isAlwaysOnTop:${win_id}`)

  // 监听置顶
  topBtn.addEventListener('click', async () => {
    const is = await ipcRenderer.invoke(`isAlwaysOnTop:${win_id}`)
    ipcRenderer.invoke(`setAlwaysOnTop:${win_id}`, !is)
    isTop.value = !is
  })
}

function danmuInput(controlBarIsOpen: { value: boolean }) {
  const inputWrap = document.querySelector('.input-wrap') as HTMLDivElement
  const inputDom = document.querySelector('.input-wrap>input') as HTMLInputElement
  const inputMaxLength = document.querySelector('.input-wrap>.length>.maxlength') as HTMLSpanElement
  const inputValueLength = document.querySelector('.input-wrap>.length>.value') as HTMLSpanElement
  const inputSwitch = document.querySelector('.input-switch>button') as HTMLButtonElement

  const maxlength = ref(20, (value) => {
    inputDom.maxLength = value
    inputMaxLength.innerHTML = String(value)
  })

  const inputLength = ref(0, (value) => {
    inputValueLength.innerHTML = String(value)
  })

  const inputIsOpen = ref(false, (value) => {
    inputWrap.classList.toggle('open', value)
  })

  // 修改可输入的最大长度
  matchMaxDanmu().then((max) => {
    maxlength.value = max
  })

  // 监听输入
  inputDom.addEventListener('input', () => {
    inputLength.value = inputDom.value.length
  })

  // 监听按钮
  inputSwitch.addEventListener('click', () => {
    inputIsOpen.value = !inputIsOpen.value
  })

  // 监听回车发送
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (inputIsOpen.value) {
        // 发送
        sendDanmu(inputDom.value.trim())

        // 清空
        inputDom.value = ''
        inputLength.value = 0
        inputIsOpen.value = false
      } else {
        controlBarIsOpen.value = true
        inputIsOpen.value = true
        inputDom.focus()
      }
    }

    if (e.key === 'Escape') {
      inputIsOpen.value = false
      controlBarIsOpen.value = false
    }
  })
}

function controlBar() {
  const controlBar = document.querySelector('.control-bar') as HTMLDivElement

  const controlBarIsOpen = ref(false, (value) => controlBar.classList.toggle('open', value))

  // 监听鼠标进入窗口和离开窗口事件
  document.addEventListener('mousemove', () => {
    controlBarIsOpen.value = true
  })
  document.addEventListener('mouseleave', () => {
    controlBarIsOpen.value = false
  })

  return {
    controlBarIsOpen
  }
}

export async function createControlBar() {
  createDom(template)

  topBtn()
  const { controlBarIsOpen } = controlBar()
  danmuInput(controlBarIsOpen)
  closeBtn()
  minBtn()
}
