const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const config = require('../package.json')

const filePath = path.resolve(
  __dirname,
  '../build',
  `blive-monitor-win32-x64-${config.version}.exe`
)

// 创建一个可读流
const stream = fs.createReadStream(filePath)

// 创建一个 hash 实例，使用 'sha256' 算法
const hash = crypto.createHash('sha256')

// 将文件流通过 hash 更新
stream.on('data', (data) => hash.update(data))

// 文件读取完成后，计算最终散列值
stream.on('end', () => {
  const sha256 = hash.digest('hex')
  fs.writeFileSync(path.resolve(__dirname, '../build/sha256.txt'), sha256)
  console.log(`SHA-256 Hash: ${sha256}`)
})

// 处理错误
stream.on('error', (error) => {
  console.error('Error reading file:', error.message)
})
