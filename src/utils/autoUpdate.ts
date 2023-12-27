import axios, { AxiosResponse } from 'axios'
import info from '../config.json'
import { BrowserView, BrowserWindow, app } from 'electron'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import type { GithubReleasesLatest } from '../types/autoUpdate'

import downloadFile from './downloadFile'
import { isExists } from './isExists'
import { exec, execSync } from 'child_process'

const giteeUrl = 'https://gitee.com/yanchenbai/blive-monitor/releases/latest'
const githubUrl = 'https://api.github.com/repos/YanChenBai/blive-monitor/releases/latest'

// 更新下载的位置
const updateDir = app.isPackaged
  ? path.resolve(process.resourcesPath, 'updatePath')
  : path.resolve(__dirname, '../../updatePath')

async function getSha256(url: string) {
  try {
    const res = await axios.get<string>(url)
    return res.data
  } catch (error) {
    throw new Error('获取校验数据错误!')
  }
}

export enum Platform {
  WIN,
  MAC
}

/** 下载源 */
export enum Origin {
  GITHUB,
  GITEE
}

/** 状态 */
export enum ONStatus {
  DOWNLOADING,
  DOWNLOADED,
  CHECKING,
  CHECKED,
  FAILED
}

/** 自动更新配置 */
interface AppUpdateOptions {
  win: BrowserWindow
  platform: Platform
  version: string
  auto: boolean
  origin: Origin
}

export default class AppUpdate {
  isOnUpdate = false
  win: BrowserWindow
  platform: Platform
  version: string
  auto: boolean
  origin: Origin

  constructor(options: AppUpdateOptions) {
    this.win = options.win
    this.platform = options.platform
    this.version = options.version
    this.auto = options.auto
    this.origin = options.origin
  }

  get = () => axios.get<GithubReleasesLatest>(githubUrl)

  /** 检查更新 */
  async check() {
    if (this.origin === Origin.GITHUB) {
      const { data } = await this.get()

      // 判断是否是最新的版本
      if (data.tag_name.replace('v', '') === this.version) {
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  }

  /** 下载更新 */
  async download() {
    try {
      if (this.isOnUpdate) {
        this.onUpate(ONStatus.FAILED, '正在下载中，请稍后...')
        throw new Error('正在下载中，请稍后...')
      }

      const { data } = await this.get()

      // 查找对应的安装包和散列值
      const fileItem = data.assets.find((item) => item.name.includes('blive-monitor-win32-x64'))
      const sha256Item = data.assets.find((item) => item.name.includes('sha256'))

      if (!sha256Item || !fileItem) throw new Error('更新信息获取失败!')

      // 先检查一下目录存不存在
      await isExists(updateDir)

      // 加个锁
      this.isOnUpdate = true

      // 下载位置
      const filePath = path.resolve(updateDir, fileItem.name)
      console.log(filePath)

      // 下载开始事件
      this.onUpate(ONStatus.DOWNLOADING)

      // 请求下载并阻塞
      await downloadFile(fileItem.browser_download_url, filePath, (percent) => {
        // 下载进度
        this.onDownloadProgress(percent)
      })

      // 下载完成开始事件
      this.onUpate(ONStatus.DOWNLOADED)

      this.isOnUpdate = false
      return { filePath, answerUrl: sha256Item.browser_download_url }
    } catch (error) {
      this.isOnUpdate = false
      this.onUpate(ONStatus.FAILED, `下载错误`)
      throw new Error('下载错误')
    }
  }

  /** 校验文件完整性 */
  verify(answerUrl: string, filePath: string) {
    return new Promise<boolean>(async (resolve, reject) => {
      let answer: string
      try {
        answer = await getSha256(answerUrl)
      } catch (error) {
        this.onUpate(ONStatus.FAILED, `获取校验错误`)
        reject(error)
        return
      }

      this.onUpate(ONStatus.CHECKING)
      // 文件大小
      const totalSize = fs.statSync(filePath).size
      // 已经计算的大小
      let nowSize = 0
      // 创建一个可读流
      const stream = fs.createReadStream(filePath)

      // 创建一个 hash 实例，使用 'sha256' 算法
      const hash = crypto.createHash('sha256')

      // 将文件流通过 hash 更新
      stream.on('data', (data) => {
        hash.update(data)
        nowSize += data.length
        const progress = (nowSize / totalSize) * 100
        this.onVerifyProgress(progress)
      })

      // 文件读取完成后，计算最终散列值
      stream.on('end', () => {
        const ok = hash.digest('hex') === answer
        this.onUpate(ONStatus.CHECKED, ok)
        resolve(ok)
      })

      // 处理错误
      stream.on('error', (error) => {
        this.onUpate(ONStatus.FAILED, `计算完整性错误`)
        reject(error)
      })
    })
  }

  /** 安装更新 */
  async install() {
    // 下载
    const { filePath, answerUrl } = await this.download()

    // 验证
    const status = await this.verify(answerUrl, filePath)
    if (status) exec(`start ${filePath}`)
    app.quit()
  }

  /** 更新状态 */
  onUpate(status: ONStatus, data?: String | boolean) {
    this.win.webContents.send('onUpate', { status, data })
  }

  /** 下载更新进度 */
  onDownloadProgress(progress: number) {
    this.win.webContents.send('onDownloadProgress', progress)
  }

  /** 检验进度 */
  onVerifyProgress(progress: number) {
    this.win.webContents.send('onVerifyProgress', progress)
  }
}
