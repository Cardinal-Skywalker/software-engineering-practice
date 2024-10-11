import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(VueAxios,axios)

app.mount('#app')
