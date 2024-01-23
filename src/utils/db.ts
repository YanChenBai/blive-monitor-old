import { Low } from '@huanshiwushuang/lowdb'
import { JSONFile } from '@huanshiwushuang/lowdb/node'
import lodash from 'lodash'
import { DB_PATH } from './paths'

export interface DBConfig {
  roomId: string
  isAlwaysOnTop: boolean
  isKeepAspectRatio: boolean
  width?: number
  height?: number
  x?: number
  y?: number
  volume?: number
}

interface DBData {
  config: DBConfig[]
}

class LowWithLodash<T> extends Low<T> {
  chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data')
}

const defaultData: DBData = {
  config: []
}
const adapter = new JSONFile<DBData>(DB_PATH)

export const getDB = async () => {
  const db = new LowWithLodash(adapter, defaultData)
  await db.read()
  return db
}
