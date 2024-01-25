import { createApp } from 'vue'
import App from './App.plugin.vue'
import pinia from '@/stores'
import 'uno.css'

const div = document.createElement('div')
div.id = 'plugin'
document.body.appendChild(div)

const app = createApp(App)
app.use(pinia)
app.mount(div)
