import fs from 'fs'
import path from 'path'

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

const inputHtml = fs.readFileSync(path.resolve(__dirname, 'index.html')).toString()

window.onload = async () => {
  // 等待livePlayer对象挂载
  await awaitLivePlayer()

  /** 启用网页全屏 */
  await Promise.all([window.livePlayer?.setFullscreenStatus(1)])

  /** 关闭弹幕侧边栏 */
  document.body.setAttribute('class', `${document.body.getAttribute('class')} hide-aside-area`)

  /** 添加拖拽栏 */
  const menu = document.createElement('div')
  menu.classList.add('drag-menu')
  document.body.appendChild(menu)

  /** 弹幕输入框 */
  const inputWrap = document.createElement('div')
  inputWrap.classList.add('input-wrap')
  inputWrap.innerHTML = inputHtml

  /** 添加弹幕输入框 */
  document.body.appendChild(inputWrap)

  function changeInputStatus() {
    const danmuInput = document.querySelector('.danmu-input') as HTMLDivElement
    const inputSwitchValue = document.querySelector('.input-switch-value') as HTMLSpanElement
    if (danmuInput.style.display === 'none') {
      inputSwitchValue.innerText = '关'
      danmuInput.style.display = 'block'
    } else {
      inputSwitchValue.innerText = '开'
      danmuInput.style.display = 'none'
    }
  }

  /** 监听按钮 */
  const btn = document.querySelector('.input-switch>button') as HTMLButtonElement
  btn.addEventListener('click', changeInputStatus)
  // document.body.appendChild(danmuInput)
  // const inputSwitch = document.getElementById('danmu-input-switch') as HTMLButtonElement

  // document.addEventListener('mouseenter', () => {
  //   inputSwitch.style.display = 'block'
  // })

  // document.addEventListener('mouseleave', () => {
  //   inputSwitch.style.display = 'none'
  // })

  // function inputSwitchChange(state: boolean) {
  //   const danmuNum = document.getElementById('danmu-num') as HTMLDivElement
  //   const dom = document.getElementById('danmu-input') as HTMLInputElement
  //   const displayVal = state ? 'block' : 'none'

  //   inputSwitch.innerText = '发送:' + (state ? '关' : '开')
  //   danmuNum.style.display = displayVal
  //   dom.style.display = displayVal
  // }

  // /** 切换输入框显示状态 */
  // inputSwitch.addEventListener('click', () => {
  //   const danmuNum = document.getElementById('danmu-num') as HTMLDivElement
  //   const dom = document.getElementById('danmu-input') as HTMLInputElement
  //   inputSwitchChange(dom.style.display === 'none')
  // })

  // const input = document.getElementById('danmu-input') as HTMLInputElement

  // /** 更新显示文本长度 */
  // input.addEventListener('input', () => {
  //   const dom = danmuInput.querySelector('#danmu-num') as HTMLDivElement
  //   dom.innerText = input.value.length.toString() + '/20'
  // })

  // /** 发送弹幕 */
  // function sendDanmu(msg: string) {
  //   if (msg.length <= 0) {
  //     console.log('请输入弹幕内容')
  //     return
  //   }
  //   const bliDanmuInput = document.querySelector(
  //     '#control-panel-ctnr-box > div.chat-input-ctnr.p-relative > div:nth-child(2) > textarea'
  //   ) as HTMLTextAreaElement
  //   const bliDanmuSendBtn = document.querySelector(
  //     '.control-panel-ctnr .chat-input-ctnr ~ .bottom-actions .bl-button--primary'
  //   ) as HTMLButtonElement

  //   /** 创建一个输入事件 */
  //   const inputEvent = new Event('input', {
  //     bubbles: true,
  //     cancelable: true
  //   })
  //   bliDanmuInput.value = msg

  //   /** 触发输入事件 */
  //   bliDanmuInput.dispatchEvent(inputEvent)

  //   /** 触发发送按钮 */
  //   bliDanmuSendBtn.click()
  // }

  // /** 监听回车发送 */
  // input.addEventListener('keydown', (e) => {
  //   if (e.key === 'Enter') {
  //     /** 发送 */
  //     sendDanmu(input.value.trim())
  //     /** 清空 */
  //     input.value = ''
  //   }
  // })

  /** 去掉弹窗 */
  setTimeout(() => clearInterval(timer), 10000)
  const timer = setInterval(() => {
    document.querySelectorAll('.shop-popover').forEach((item) => {
      clearInterval(timer)
      ;(item as HTMLDivElement).style.display = 'none'
    })
  }, 100)
}
