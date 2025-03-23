// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import socketPlugin from "./plugins/socket";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(socketPlugin); // Register the socket plugin

app.mount('#app')
