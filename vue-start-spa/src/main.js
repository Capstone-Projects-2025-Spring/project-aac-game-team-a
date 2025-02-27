import { createApp } from 'vue';
import App from './App.vue';
// import bootstrap for CSS
import '../node_modules/bootstrap/dist/css/bootstrap.css';
// import the bus
import $bus from './utilities/Events';

const app = createApp(App)

app.config.globalProperties.$bus = $bus; 

app.mount('#app');
