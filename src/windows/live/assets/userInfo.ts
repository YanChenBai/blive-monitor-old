import { html } from 'proper-tags'
import { ipcRenderer } from 'electron'
import { win_id } from './getWinId'
import { OpenRoom } from '../../../types/bili'
import { createDom } from './tools'

export async function createUaerInfo() {
  const { name, face } = (await ipcRenderer.invoke(`getRoomData:${win_id}`)) as OpenRoom
  createDom(html`
    <div class="user-info">
      <div class="face">
        <img src="${face}" />
      </div>
      <div class="name">${name}</div>
    </div>
  `)
}
