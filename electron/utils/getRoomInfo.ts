import axios from 'axios'
import { RoomInfo, UserInfo, ManyUserInfo } from '../types/bili'
import { chunk } from 'lodash'

/**
 * 获取直播间信息
 * @param room_id 房间号, 支持短号
 */
export async function getInfo(room_id: string) {
  const { uid, short_id, tags, live_status, title, keyframe } = await fetch(
    `https://api.live.bilibili.com/room/v1/Room/get_info?id=${room_id}`
  )
    .then((res) => res.json() as Promise<RoomInfo>)
    .then((res) => {
      if (res.code === 0) {
        return {
          uid: res.data.uid,
          short_id: res.data.short_id,
          tags: res.data.tags,
          live_status: res.data.live_status,
          title: res.data.title,
          keyframe: res.data.keyframe
        }
      } else {
        return Promise.reject(res)
      }
    })

  return await fetch(`https://api.live.bilibili.com/live_user/v1/Master/info?uid=${uid}`)
    .then((res) => res.json() as Promise<UserInfo>)
    .then((res) => {
      if (res.code === 0) {
        return {
          uid: String(uid),
          room_id: String(res.data.room_id),
          short_id: String(short_id),
          name: res.data.info.uname,
          face: res.data.info.face,
          live_status: live_status,
          tags: tags,
          title,
          medal_name: res.data.medal_name,
          keyframe
        }
      } else {
        return Promise.reject(res)
      }
    })
}

export async function getManyInfo(uids: string[]) {
  const chunks = chunk(uids, 20)
  return Promise.all(
    chunks.map((item) =>
      axios
        .get<ManyUserInfo>('https://api.live.bilibili.com/room/v1/Room/get_status_info_by_uids', {
          params: {
            uids: item
          }
        })
        .then((res) => {
          if (res.data.code === 0) {
            return res.data.data
          } else {
            return Promise.reject(res)
          }
        })
    )
  ).then((res) =>
    res.reduce((acc, cur) => {
      return { ...acc, ...cur }
    }, {})
  )
}
