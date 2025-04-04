// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import socketClient from './socketClient'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(socketClient)

app.mount('#app')
