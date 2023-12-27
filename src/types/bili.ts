export interface RoomInfo {
  code: number
  msg: string
  message: string
  data: {
    uid: number
    room_id: number
    short_id: number
    attention: number
    online: number
    is_portrait: boolean
    description: string
    live_status: number
    area_id: number
    parent_area_id: number
    parent_area_name: string
    old_area_id: number
    background: string
    title: string
    user_cover: string
    keyframe: string
    is_strict_room: boolean
    live_time: string
    tags: string
    is_anchor: number
    room_silent_type: string
    room_silent_level: number
    room_silent_second: number
    area_name: string
    // more...
  }
}

export interface UserInfo {
  code: number
  msg: string
  message: string
  data: {
    info: {
      uid: number
      uname: string
      face: string
      official_verify: {}
    }
    exp: { master_level: {} }
    follower_num: number
    room_id: number
    medal_name: string
    glory_count: number
    pendant: string
    link_group_num: number
    room_news: {
      content: string
      ctime: string
      ctime_text: string
    }
  }
}

export interface OpenRoom {
  name: string
  face: string
  room_id: string // 需要时真实房间号
}
