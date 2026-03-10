import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { initGame } from './game'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')

// 初始化游戏
initGame()

console.log('🏰 H3-CMlike 游戏已启动！')
