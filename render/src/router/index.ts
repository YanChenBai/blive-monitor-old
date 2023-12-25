import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LiveView from '@/views/LiveView.vue'
import { ref } from 'vue'
import { useRoomsStore } from '@/stores/rooms'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: {
        fold: true,
        foldBtn: false
      }
    },
    {
      path: '/live',
      name: 'Live',
      component: LiveView,
      meta: {}
    }
  ]
})

/** 全局监听路由 */
router.beforeEach((to, _from, next) => {
  const roomsStore = useRoomsStore()
  if (to.meta) {
    const { fold, foldBtn } = to.meta
    roomsStore.showMenuState = fold === undefined ? false : fold
    roomsStore.showFoldBtn = foldBtn === undefined ? true : foldBtn
  }
  next()
})

export default router
