import axios from 'axios'
import { awaitLivePlayer, awaitThing } from './livePlayer'
import { Emoticon, Emoticons, GetEmoticons } from '../../../types/bili'
import { mockGetEmoticons } from './mock'
import { html } from 'proper-tags'
import { createDom } from './tools'

let showId: number
const api = axios.create({
  baseURL: 'https://api.live.bilibili.com',
  withCredentials: true
})

/**
 * 获取房间表情号
 * @param roomId 真实的房间id
 */
export async function getEmoticons(roomId: string) {
  return await api
    .get<GetEmoticons>(`/xlive/web-ucenter/v2/emoticon/GetEmoticons?platform=pc&room_id=${roomId}`)
    .then((res) => {
      console.log(res.data)
      return res.data.data.data
    })
}

/**
 * 发送表情
 * @param emoji 表情
 */
export async function sendEmoji(data: Emoticon) {
  const livePlayer = await awaitLivePlayer()
  return await livePlayer.sendDanmaku({
    msg: data.emoticon_unique,
    mode: 1,
    bubble: 0,
    dm_type: 1,
    emoticonOptions: {
      bulgeDisplay: data.bulge_display,
      emoji: data.emoji,
      emoticonUnique: data.emoticon_unique,
      height: data.height,
      width: data.width,
      url: data.url,
      inPlayerArea: data.in_player_area,
      isDynamic: data.is_dynamic
    }
  })
}

function tabHeaderClickHandler(data: Emoticons[], pkgId: number) {
  // 隐藏现在显示的tab
  const curTab = document.querySelector(`.emoji-tab[data-tab-id="${showId}"]`) as HTMLDivElement
  const showTab = document.querySelector(`.emoji-tab[data-tab-id="${pkgId}"]`) as HTMLDivElement
  curTab.classList.add('hide')
  showId = pkgId
  // 看看要显示的tab是否创建
  if (showTab) {
    showTab.classList.remove('hide')
  } else {
    const find = data.find((item) => item.pkg_id === pkgId)
    if (find) createEmojiTab(find)
  }
}

/** 获取头部选项卡 */
function getHeaders(data: Emoticons[]) {
  const dom = document.createElement('div')
  dom.classList.add('emoji-header')

  dom.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    const pkgId = target.getAttribute('data-tab-id')
    if (pkgId) tabHeaderClickHandler(data, Number(pkgId))
  })

  dom.innerHTML = data.reduce((pre, cur) => {
    return (
      pre +
      html`
        <div class="emoji-header-item">
          <img src="${cur.current_cover}" title="${cur.pkg_name}" data-tab-id="${cur.pkg_id}" />
        </div>
      `
    )
  }, '')

  return dom
}

function tabContentClickHandler(data: Emoticon) {
  if (data.is_dynamic === 1) {
    if (data.perm === 1) sendEmoji(data)
  } else {
    const inputDom = document.querySelector('.input-wrap>input') as HTMLInputElement
    /** 创建一个输入事件 */
    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true
    })
    inputDom.value = inputDom.value + data.emoji

    /** 触发输入事件 */
    inputDom.dispatchEvent(inputEvent)
  }
}

function getEmojiHtml(data: Emoticon, index: number, width: string, isHistory = false) {
  return html`
    <div class="emoji-tab-item ${data.perm === 0 ? 'not' : ''}" style="width: ${width}">
      <img
        src="${data.url}"
        title="${data.emoji}"
        data-emoji-index="${index}"
        ${isHistory ? 'data-is-history="1"' : ''}
      />
    </div>
  `
}

/** 获取标签内容 */
function createEmojiTab(data: Emoticons) {
  const dom = document.createElement('div')
  dom.classList.add('emoji-tab')
  dom.setAttribute('data-tab-id', String(data.pkg_id))

  /** 监听点击事件 */
  dom.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    const index = target.getAttribute('data-emoji-index')
    const isHistory = target.getAttribute('data-is-history')
    if (index) {
      tabContentClickHandler(
        isHistory ? data.recently_used_emoticons[Number(index)] : data.emoticons[Number(index)]
      )
    }
  })

  const tmpItem = data.emoticons[0]
  const width =
    tmpItem.width === 0 ? '12.5%' : tmpItem.width - tmpItem.height >= 10 ? '25%' : '16.66%'

  let str = ''

  // 判断是否需要添加最近使用
  if (data.recently_used_emoticons.length > 0) {
    str = data.recently_used_emoticons.reduce(
      (pre, cur, curIndex) => pre + getEmojiHtml(cur, curIndex, width, true),
      ''
    )

    str = html`
      <div class="emoji-tab-item-title">最近使用</div>
      ${str}
      <div class="emoji-tab-item-title">全部表情</div>
    `
  }

  dom.innerHTML = data.emoticons.reduce(
    (pre, cur, curIndex) => pre + getEmojiHtml(cur, curIndex, width),
    str
  )
  const emojiContentDom = document.querySelector('.emoji-content') as HTMLDivElement
  emojiContentDom.appendChild(dom)
}
export async function createEmojiPopover(inputWrap: HTMLDivElement, roomId: string) {
  const dom = document.createElement('div')
  dom.classList.add('emoji-popover')
  dom.innerHTML = html`<div class="emoji-content"></div>`
  inputWrap.appendChild(dom)

  const emoticons = await getEmoticons(roomId)
  const popover = document.querySelector('.emoji-popover') as HTMLDivElement
  const content = popover.querySelector('.emoji-content') as HTMLDivElement

  // 插入选项卡元素
  popover.insertBefore(getHeaders(emoticons), popover.firstChild)

  // 设置默认选项卡显示
  showId = emoticons[0].pkg_id
  createEmojiTab(emoticons[0])

  // 阻止冒泡,避免滚动调整音量触发 和 滚动间隔调整
  const setp = 10
  popover.addEventListener('wheel', (event) => {
    content.scrollTop += event.deltaY > 0 ? setp : -setp
    event.preventDefault()
    event.stopPropagation()
  })
}
