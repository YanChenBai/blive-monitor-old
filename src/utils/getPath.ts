import { app } from 'electron'
import path from 'path'

export function getIconPath(room_id: string) {
  return path.join(app.getAppPath(), 'resources', 'icons', `${room_id}.png`)
}

export function getDBPath() {
  return path.join(app.getAppPath(), 'resources', 'db.json')
}
