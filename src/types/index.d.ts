declare interface Window {
  win_id: string
  livePlayer?: {
    NAME: string
    VERSION: string
    addLoadingPicture: () => void
    appendCtrlItem: () => void
    capturePic: () => void
    changeCtrlIconVisible: () => void
    changeCtrlVisible: () => void
    changeDanmakuExtraConfig: () => void
    changeUIStatus: () => void
    destroy: () => void
    discardFrame: () => void
    featSupport: () => void
    freeze: () => void
    getAudioTracks: () => void
    getOperableElements: () => void
    getP2PTransport: () => void
    getPlayerInfo: () => {
      type: number
      version: string
      playerType: string
      liveStatus: number
      playerStatus: number
      playingStatus: boolean
      playurl: string
      guid: string
      quality: string
      qualityCandidates: { qn: string; desc: string }[]
      timeShift: number
    }
    getVideoEl: () => void
    init: () => void
    injectInitAPIData: () => void
    loadVideo: () => void
    noticeGift: () => void
    notifyAnnouncement: () => void
    notifyInOperation: () => void
    on: () => void
    once: () => void
    pause: () => void
    play: () => void
    refresh: () => void
    reload: () => void
    remainBufferLength: () => void
    /** 重置弹幕容器大小  */
    resize: () => void
    sendDanmaku: () => void
    sendGift: () => void
    set: () => void
    setBottomBar: () => void
    setChasingFrameThreshold: () => void
    setDanmaku: () => void
    setFullscreenDanmaku: () => void
    /**
     * 切换全屏状态
     * @param status 0 - 全屏, 1 - 网页全屏
     *  */
    setFullscreenStatus: (status: number) => void
    setToastCssText: () => void
    stopPlayback: () => void
    supportMaskDanmaku: () => void
    switchAudioTrack: () => void
    switchQuality: () => void
    toast: () => void
    updateDMSetting: () => void
    userFeedback: () => void
    volume: () => void
  }
}