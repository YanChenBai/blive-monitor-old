import { cp } from 'fs/promises'
import path from 'path'

const from = path.resolve(__dirname, '../../render/dist')
const to = path.resolve(__dirname, '../dist-render')
console.log('from:', from)
console.log('to:', to)

cp(from, to, { recursive: true, force: true })
