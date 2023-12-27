import axios from 'axios'
import fs from 'fs'

/**
 * 文件下载
 * @param url url地址
 * @param path 保存的路径
 * @param progressCallback 更新进度回调
 * @returns
 */
export default async function (
  url: string,
  path: string,
  progressCallback: (percent: number) => void
) {
  return await axios({
    method: 'GET',
    url,
    responseType: 'stream'
  }).then((res) => {
    // 文件总大小
    const totalSize = res.headers['content-length']
    // 已下载的数据大小
    let downloadedSize = 0

    // 将响应的数据流传输到文件流
    res.data.pipe(fs.createWriteStream(path))

    // 监听下载进度
    res.data.on('data', (chunk: Buffer) => {
      downloadedSize += chunk.length
      const progress = (downloadedSize / totalSize) * 100
      progressCallback(progress)
    })

    return new Promise<void>((resolve, reject) => {
      // 结束
      res.data.on('end', async () => resolve())

      // 错误
      res.data.on('error', (error: Error) => reject(error))
    })
  })
}
