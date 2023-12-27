import axios, { AxiosResponse } from 'axios'
import info from '../config.json'
import { BrowserView, BrowserWindow, app } from 'electron'
import path from 'path'
import fs from 'fs'
import type { GithubReleasesLatest } from '../types/autoUpdate'
import calculateFileSha256 from './calculateFileSha256'
import downloadFile from './downloadFile'

const giteeUrl = 'https://gitee.com/yanchenbai/blive-monitor/releases/latest'
const githubUrl = 'https://api.github.com/repos/YanChenBai/blive-monitor/releases/latest'

// 更新下载的位置
const updateDir = app.isPackaged
  ? path.resolve(process.resourcesPath, 'updatePath')
  : path.resolve(__dirname, '../../updatePath')

async function isExists(dir: string) {
  const state = fs.existsSync(dir)
  if (!state) {
    return await fs.promises.mkdir(dir)
  }
}

async function getSha256(url: string) {
  try {
    const res = await axios.get<string>(url)
    return res.data
  } catch (error) {
    throw new Error('获取校验数据错误!')
  }
}

/** 更新 */
export async function update(
  info: GithubReleasesLatest,
  call: {
    download: () => void
    check: () => void
    error: () => void
    downloadProgress: (percent: number) => void
    checkProgress: (percent: number) => void
  }
) {
  try {
    // 查找对应的安装包和散列值
    const fileItem = info.assets.find((item) => item.name.includes('blive-monitor-win32-x64'))
    const sha256Item = info.assets.find((item) => item.name.includes('sha256'))

    if (!sha256Item || !fileItem) throw new Error('更新信息获取失败!')

    // 先检查一下目录存不存在
    isExists(updateDir)

    // 下载位置
    const filePath = path.resolve(updateDir, fileItem.name)

    call.download()
    // 请求下载并阻塞
    await downloadFile(fileItem.browser_download_url, filePath, (percent) => {
      call.downloadProgress(percent)
    })

    call.check()
    // 获取发布的sha256
    const checkSha256 = await getSha256(sha256Item.browser_download_url)

    // 计算文件散列
    const fileSha256 = await calculateFileSha256(filePath, (percent) => {
      call.downloadProgress(percent)
    })

    if (fileSha256 !== checkSha256) {
      throw new Error('文件校验失败！')
    }
  } catch (error) {
    console.error(error)
  }
}

export async function isHaveUpdate(origin: 'github' | 'gitee') {
  if (origin === 'github') {
    const { data } = await axios.get<GithubReleasesLatest>(githubUrl)

    // 判断是否是最新的版本
    if (data.tag_name.replace('v', '') === info.version) {
      return null
    } else {
      return data
    }
  } else {
    return null
  }
}

export async function autoCheck(interval = 1000 * 60 * 15) {
  setTimeout(() => {
    isHaveUpdate('github').then((data) => {
      if (data) {
        
      } else {
          autoCheck
      }
    })
  }, interval)
}
