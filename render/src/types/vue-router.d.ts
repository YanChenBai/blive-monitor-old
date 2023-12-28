import { RouteMeta } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    fold?: boolean
    foldBtn?: boolean
  }
}
