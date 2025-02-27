//this file is vue's entry point, the first file vue goes to when ran

import './assets/main.css'

import { createApp } from 'vue'
import aacBoard from './aacBoard.vue'

createApp(aacBoard).mount('#app')
