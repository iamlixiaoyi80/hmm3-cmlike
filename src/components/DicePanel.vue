<template>
  <div class="dice-panel">
    <div class="dice-container" @click="handleDiceClick">
      <div 
        class="dice" 
        :class="{ rolling: isRolling }"
        :style="diceStyle"
      >
        {{ displayNumber }}
      </div>
    </div>
    
    <div class="dice-info">
      <p>骰子数量: {{ diceCount }}</p>
      <p v-if="lastResult">结果: {{ lastResult }}</p>
    </div>
    
    <button 
      class="roll-btn" 
      @click="startRoll"
      :disabled="diceCount <= 0"
    >
      {{ isRolling ? '点击停止!' : '掷骰子' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/game'

const store = useGameStore()

const isRolling = ref(false)
const displayNumber = ref(1)
const animationInterval = ref(null)

const diceCount = computed(() => store.dice.count)
const lastResult = computed(() => store.dice.lastResult)

const diceStyle = computed(() => ({
  transform: isRolling.value ? 'rotate(720deg)' : 'rotate(0deg)',
  transition: isRolling.value ? 'transform 0.1s ease' : 'transform 0.3s ease'
}))

// 开始掷骰子
function startRoll() {
  if (diceCount.value <= 0) return
  
  isRolling.value = true
  store.useDice(1)
  
  // 快速切换数字
  animationInterval.value = setInterval(() => {
    displayNumber.value = Math.floor(Math.random() * 6) + 1
  }, 50)
}

// 停止骰子
function stopRoll() {
  if (!isRolling.value) return
  
  clearInterval(animationInterval.value)
  
  // 最终结果
  const result = Math.floor(Math.random() * 6) + 1
  displayNumber.value = result
  store.dice.lastResult = result
  
  isRolling.value = false
  
  // 触发事件
  console.log('🎲 骰子结果:', result)
}

// 点击处理
function handleDiceClick() {
  if (isRolling.value) {
    stopRoll()
  }
}
</script>

<style scoped>
.dice-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.dice-container {
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.dice {
  width: 100px;
  height: 100px;
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  font-weight: bold;
  color: #333;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 2px 5px rgba(255, 255, 255, 0.5);
  user-select: none;
}

.dice.rolling {
  animation: shake 0.1s infinite;
  background: linear-gradient(145deg, #ffd700, #ff8c00);
  color: #fff;
}

@keyframes shake {
  0%, 100% { transform: translateX(-2px) rotate(-5deg); }
  50% { transform: translateX(2px) rotate(5deg); }
}

.dice-info {
  color: #fff;
  text-align: center;
}

.dice-info p {
  margin: 5px 0;
  font-size: 16px;
}

.roll-btn {
  padding: 15px 40px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(145deg, #4CAF50, #45a049);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.roll-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(76, 175, 80, 0.4);
}

.roll-btn:disabled {
  background: #666;
  cursor: not-allowed;
}
</style>
