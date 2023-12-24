import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'uno.css'
import NaiveUI from 'naive-ui'
import router from './router'
import persistedstate from 'pinia-plugin-persistedstate'
const app = createApp(App)

const pinia = createPinia().use(persistedstate)
app.use(pinia)
app.use(NaiveUI)
app.use(router)

app.mount('#app')
