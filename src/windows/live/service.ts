import { OpenRoom } from '../../types/bili'
import { DBConfig, getDB } from '../../utils/db'

export async function useService(options: OpenRoom) {
  const defData = {
    roomId: options.room_id,
    isKeepAspectRatio: false,
    isAlwaysOnTop: false
  }
  const db = await getDB()

  const findIndex = () => db.chain.get('config').findIndex({ roomId: options.room_id }).value()

  if (findIndex() === -1) {
    db.data.config.push(defData)
    await db.write()
  }

  function getRoomConfig() {
    return db.data.config[findIndex()]
  }
  async function changeIsTop(state: boolean) {
    db.data.config[findIndex()].isAlwaysOnTop = state
    await db.write()
  }

  async function changeIsKeepAspectRatio(state: boolean) {
    db.data.config[findIndex()].isKeepAspectRatio = state
    await db.write()
  }

  return {
    findIndex,
    getRoomConfig,
    changeIsTop,
    changeIsKeepAspectRatio
  }
}
