import fs from 'fs'
import crypto from 'crypto'

export default function (path: string, progressCallback?: (percent: number) => void) {
  return new Promise<string>((resolve, reject) => {
    // 文件大小
    const totalSize = fs.statSync(path).size
    // 已经计算的大小
    let nowSize = 0
    // 创建一个可读流
    const stream = fs.createReadStream(path)

    // 创建一个 hash 实例，使用 'sha256' 算法
    const hash = crypto.createHash('sha256')

    // 将文件流通过 hash 更新
    stream.on('data', (data) => {
      hash.update(data)

      if (progressCallback && typeof progressCallback === 'function') {
        nowSize += data.length
        const progress = (nowSize / totalSize) * 100
        progressCallback(progress)
      }
    })

    // 文件读取完成后，计算最终散列值
    stream.on('end', () => resolve(hash.digest('hex')))

    // 处理错误
    stream.on('error', (error) => reject(error))
  })
}
