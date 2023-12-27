const fs = require('fs')
const path = require('path')

// 更新版本号
const info = require('../package.json')
const config = require('../src/config.json')

fs.writeFileSync(
  path.resolve(__dirname, '../src/config.json'),
  JSON.stringify({ version: info.version }),
  'utf-8'
)
