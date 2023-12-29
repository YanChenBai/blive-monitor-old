import { RoomInfo, UserInfo } from '../types/bili'

/**
 * 获取直播间信息
 * @param room_id 房间号, 支持短号
 */
export async function getInfo(room_id: string) {
  const { uid, short_id, tags, live_status, title } = await fetch(
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
          title: res.data.title
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
          medal_name: res.data.medal_name
        }
      } else {
        return Promise.reject(res)
      }
    })
}
