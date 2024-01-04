const css = String.raw
export default css`
  /** 关闭礼物栏 */
  #full-screen-interactive-wrap {
    display: none !important;
  }
  #fullscreen-danmaku-vm .fullscreen-danmaku {
    bottom: 5px !important;
  }

  .web-live-player-gift-icon-wrap {
    display: none;
  }

  /** 添加黑色底，让切换时不会突然闪白色 */
  body {
    overflow: hidden !important;
    background: black;
  }

  html {
    background: black;
  }

  /** 去掉水印 */
  .web-player-icon-roomStatus {
    display: none;
  }

  /* 去掉反馈按钮 */
  .web-player-icon-feedback {
    display: none;
  }

  /** 全屏播放器 */
  .live-room-app .app-content .app-body .player-and-aside-area .left-container {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100vw !important;
    height: 100vh;
    display: flex;
  }

  /** 移除下播后的推荐 */
  #live-player > div.web-player-ending-panel > div > div.web-player-ending-panel-recommendList {
    display: none !important;
  }

  /** 移除一下杂七杂八的东西 */
  .shop-popover,
  #link-footer-vm,
  #sections-vm,
  #sidebar-vm,
  #room-ssr-vm,
  #head-info-vm,
  #pk-vm,
  #awesome-pk-vm,
  #gift-control-vm {
    display: none !important;
  }

  body:hover::after {
    opacity: 1;
  }

  /** 拖拽栏 */
  body::after {
    color: rgb(241, 241, 241);
    opacity: 0;
    content: ' - 拖拽 - ';
    background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
    transition: all 0.3s;
    -webkit-app-region: drag;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999999;
    width: 100vw;
    height: 40px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /** 幻星派对互动按钮 */
  #game-id {
    display: none !important;
  }

  @media screen and (max-height: 560px) {
    #anchor-guest-box-id {
      transform: translate(-50%, 0) scale(0.8) !important;
      bottom: 0;
      top: 0 !important;
    }
  }

  .control-bar {
    position: fixed;
    z-index: 9999999;
    right: 20px;
    top: 50vh;
    transition: all 0.2s;
    transform: translate(calc(100% + 20px), -50%);
  }

  .control-bar.open {
    transform: translate(0, -50%);
  }

  .btn {
    transition: all 0.3s;
    border: 0;
    padding: 6px;
    color: #fff;
    height: 36px;
    width: 36px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
    box-sizing: border-box;
    display: block;
    font-size: 12px;
  }

  .input-switch,
  .min-win,
  .top-win {
    margin-top: 10px;
  }

  .close-win button {
    background: rgb(243, 59, 99);
    border: 2px solid rgb(241, 83, 125);
  }
  .close-win button:hover {
    background: rgba(243, 59, 99, 0.753);
  }

  .input-switch button {
    background: #f288a6ff;
    border: 2px solid rgb(240, 163, 184);
  }
  .input-switch button:hover {
    background: rgba(238, 146, 172, 0.795);
  }

  .min-win button {
    background: #00aeec;
    border: 2px solid #5bb9db;
  }
  .min-win button:hover {
    background: #00adecbe;
  }

  .top-win button {
    background: #64d496;
    border: 2px solid #8cd1ab;
  }
  .top-win button:hover {
    background: #90e4b6cb;
  }

  .top-win button.top {
    transform: rotate(180deg);
  }

  /* 输入框 */
  .input-wrap {
    width: 280px;
    display: flex;
    position: fixed;
    z-index: 9999999;
    top: 50vh;
    right: 66px;
    transform: translate(calc(100% + 66px), -50%);
    overflow: hidden;
    transition: all 0.2s;
    flex-wrap: wrap;
  }

  .input-wrap.open {
    transform: translate(0, -50%);
  }

  .input-wrap input {
    outline: unset;
    border: 0;
    width: 280px;
    height: 36px;
    background-color: #fff;
    color: #000;
    border-radius: 6px;
    transition: all 0.3s;
    padding: 10px 40px 10px 10px;
    box-sizing: border-box;
    border: 2px solid #f288a6ff;
  }

  .input-wrap .length {
    position: absolute;
    right: 10px;
    height: 36px;
    line-height: 36px;
    color: #464545;
    opacity: 0.8;
  }

  .change-volume {
    background: rgba(0, 0, 0, 0.8);
    width: 60px;
    height: 60px;
    position: absolute;
    z-index: 999999;
    left: 50vw;
    top: 50vh;
    transform: translateY(-50%) translateX(-50%);
    line-height: 60px;
    text-align: center;
    font-size: 20px;
    border-radius: 6px;
    user-select: none;
    color: #fff;
  }

  .user-info {
    position: fixed;
    z-index: 99999;
    display: flex;
    align-items: center;
    right: 10px;
    top: 20px;
    background-color: rgba(0, 0, 0, 0.7);
    padding-left: 4px;
    border-radius: 50px;
    transition: all 0.3s;
    transform: translateX(calc(100% + 10px));
    flex-direction: row-reverse;
    color: #fff;
  }

  .user-info.open {
    transform: translateX(0);
  }
  .user-info .face img {
    width: 100%;
  }
  .user-info .face {
    width: 38px;
    height: 38px;
    overflow: hidden;
    border-radius: 19px;
  }
  .user-info .name {
    font-size: 14px;
    font-weight: 600;
    padding: 0 6px;
  }

  .emoji-popover {
    height: 130px;
    background-color: #fff;
    border: 2px #f288a6ff solid;
    padding: 4px;
    overflow: hidden;
    border-radius: 10px;
    margin-top: 4px;
  }
  .emoji-popover img {
    width: 100%;
    user-select: none;
    cursor: pointer;
  }

  .emoji-header {
    display: flex;
    align-items: center;
    justify-content: start;
    border-bottom: 2px #8b848438 solid;
    padding-bottom: 4px;
    margin-bottom: 4px;
  }
  .emoji-header-item {
    width: 30px;
    height: 30px;
    padding: 2px;
    box-sizing: border-box;
  }

  .emoji-content {
    padding-top: 4px;
    box-sizing: border-box;
    width: 100%;
    height: calc(130px - 30px - 10px);
    overflow-y: scroll;
  }

  .emoji-content::-webkit-scrollbar {
    width: 6px;
  }

  .emoji-content::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }

  .emoji-content::-webkit-scrollbar-thumb {
    background-color: #555;
  }

  .emoji-content::-webkit-scrollbar-thumb:hover {
    background-color: #222;
  }

  .emoji-tab {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .emoji-tab.hide {
    display: none;
  }
  .emoji-tab-item-title {
    width: 100%;
    color: #222;
  }
  .emoji-tab-item {
    padding: 4px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .emoji-tab-item.not {
    opacity: 0.4;
  }
  .emoji-tab-item img {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
`
