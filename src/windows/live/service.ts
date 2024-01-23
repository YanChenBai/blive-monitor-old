import { Room } from '../../types/bili'
import { getDB } from '../../utils/db'

export async function useService(room: Room) {
  const defData = {
    roomId: room.room_id,
    isKeepAspectRatio: false,
    isAlwaysOnTop: false
  }
  const db = await getDB()

  const findIndex = () => db.chain.get('config').findIndex({ roomId: room.room_id }).value()
  room
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

  async function setPosition(x: number, y: number) {
    const index = findIndex()
    db.data.config[index].x = x
    db.data.config[index].y = y
    await db.write()
  }
  async function setSize(width: number, height: number) {
    const index = findIndex()
    db.data.config[index].width = width
    db.data.config[index].height = height
    await db.write()
  }

  async function setVolume(volume: number) {
    const index = findIndex()
    db.data.config[index].volume = volume
    await db.write()
  }

  return {
    findIndex,
    getRoomConfig,
    changeIsTop,
    changeIsKeepAspectRatio,
    setPosition,
    setSize,
    setVolume
  }
}
