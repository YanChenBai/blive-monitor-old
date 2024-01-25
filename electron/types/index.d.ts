import { LivePlayer } from './livePlayer'

declare global {
  interface Window {
    livePlayer?: LivePlayer
  }
}
