import { createApp } from 'vue'
import App from './App.vue'
import NaiveUI from 'naive-ui'
import router from './router'
import pinia from '@/stores'
import 'uno.css'

const app = createApp(App)

app.use(pinia)
app.use(NaiveUI)
app.use(router)

app.mount('#app')
