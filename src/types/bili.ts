interface Response {
  code: number
  msg: string
  message: string
}

export interface RoomInfo extends Response {
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

export interface UserInfo extends Response {
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

export interface ManyUserInfoItem {
  title: string
  room_id: number
  uid: number
  online: number
  live_time: number
  live_status: number
  short_id: number
  area: number
  area_name: string
  area_v2_id: number
  area_v2_name: string
  area_v2_parent_name: string
  area_v2_parent_id: number
  uname: string
  face: string
  tag_name: string
  tags: string
  cover_from_user: string
  keyframe: string
  lock_till: string
  hidden_till: string
  broadcast_type: number
}

export interface ManyUserInfo extends Response {
  data: Record<string, ManyUserInfoItem>
}

export interface Room {
  uid: string // 账号id
  room_id: string // 房间id
  short_id: string // 房间短号, 没有时为0
  name: string // 主播名字
  face: string // 头像
  live_status: number // 直播状态, 0 下播, 1 直播, 2 轮播
  tags: string // 主播的标签
  title: string // 直播标题
  medal_name: string // 粉丝牌名字
  keyframe: string // 封面
}

export interface Emoticon {
  emoji: string
  descript: string
  url: string
  is_dynamic: number
  in_player_area: number
  width: number
  height: number
  identity: number
  unlock_need_gift: number
  perm: number
  unlock_need_level: number
  emoticon_value_type: number
  bulge_display: number
  unlock_show_text: string
  unlock_show_color: string
  emoticon_unique: string
  unlock_show_image: string
  emoticon_id: number
}

export interface TopShow {
  top_left: { image: string; text: string }
  top_right: { image: string; text: string }
}

export interface Emoticons {
  emoticons: Emoticon[]
  pkg_id: number
  pkg_name: string
  pkg_type: number
  pkg_descript: string
  pkg_perm: number
  unlock_identity: number
  unlock_need_gift: number
  current_cover: string
  recently_used_emoticons: Emoticon[]
  top_show: TopShow
  top_show_recent: TopShow
}

export interface GetEmoticons extends Response {
  code: number
  data: {
    data: Emoticons[]
    purchase_url: string | null
    fans_brand: number
  }
}
