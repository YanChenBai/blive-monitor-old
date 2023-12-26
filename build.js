const fs = require('fs')
const path = require('path')

const allowedExtensions = ['.css', '.html']
const from = path.resolve(__dirname, './src/windows/live')
const to = path.resolve(__dirname, './dist/windows/live')

fs.readdirSync(from).forEach((file) => {
  const fileExtension = path.extname(file)
  if (allowedExtensions.includes(fileExtension)) {
    fs.copyFileSync(path.resolve(from, file), path.resolve(to, file))
  }
})
