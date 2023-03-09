import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './app.vue'
import router from './app/router.js'
import i18n from './utils/i18n.js'

import './assets/index.css'

const app = createApp(App)

app.use(i18n())
app.use(createPinia())
app.use(router())

app.mount('#app')
