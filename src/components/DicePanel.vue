<template>
  <div class="dice-panel">
    <!-- 骰子容器 -->
    <div class="dice-wrapper" :class="{ shaking: isShaking }">
      <Dice3D 
        ref="dice3DRef"
        :state="animationState"
        :type="diceType"
        :result="result"
        @click="handleDiceClick"
      />
      
      <!-- 特效层 -->
      <DiceEffects 
        ref="effectsRef"
        :state="animationState"
        :result="result"
        :type="diceType"
        @effect-complete="onEffectComplete"
      />
    </div>
    
    <!-- 骰子信息 -->
    <div class="dice-info">
      <p class="dice-count">
        <span class="icon">🎲</span>
        骰子: {{ diceCount }}
      </p>
      <p v-if="result" class="last-result">
        上次结果: <span :class="diceType">{{ result }}</span>
      </p>
    </div>
    
    <!-- 操作按钮 -->
    <div class="controls">
      <button 
        class="roll-btn"
        :class="{ rolling: isRolling }"
        :disabled="diceCount <= 0 && !isRolling"
        @click="handleButtonClick"
      >
        <span v-if="isRolling">🎯 点击停止!</span>
        <span v-else>🎲 掷骰子</span>
      </button>
      
      <!-- 骰子类型选择（测试用） -->
      <div class="dice-type-selector">
        <button 
          v-for="type in diceTypes" 
          :key="type.value"
          class="type-btn"
          :class="[type.value, { active: diceType === type.value }]"
          @click="diceType = type.value"
          :title="type.label"
        >
          {{ type.icon }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../stores/game'
import Dice3D from './dice/Dice3D.vue'
import DiceEffects from './dice/DiceEffects.vue'
import { useDiceAnimation, DiceState, DiceType } from '../composables/useDiceAnimation'

const store = useGameStore()
const dice3DRef = ref(null)
const effectsRef = ref(null)
const isShaking = ref(false)

const {
  state: animationState,
  result,
  diceType,
  isRolling,
  throwDice,
  stopDice,
  reset,
  vibrate
} = useDiceAnimation()

const diceCount = computed(() => store.dice.count)

// 骰子类型列表（测试用）
const diceTypes = [
  { value: 'normal', label: '普通', icon: '⚪' },
  { value: 'golden', label: '黄金', icon: '🟡' },
  { value: 'attack', label: '攻击', icon: '🔴' },
  { value: 'shield', label: '盾牌', icon: '🔵' }
]

// 处理骰子点击
async function handleDiceClick() {
  if (isRolling.value) {
    await stopRoll()
  }
}

// 处理按钮点击
function handleButtonClick() {
  if (isRolling.value) {
    stopRoll()
  } else {
    startRoll()
  }
}

// 开始掷骰子
async function startRoll() {
  if (diceCount.value <= 0 || isRolling.value) return
  
  // 消耗骰子
  store.useDice(1)
  
  // 震动反馈
  vibrate('light')
  
  // 屏幕震动
  isShaking.value = true
  setTimeout(() => {
    isShaking.value = false
  }, 200)
  
  // 执行动画
  if (dice3DRef.value?.cubeRef) {
    const finalResult = await throwDice(dice3DRef.value.cubeRef)
    if (finalResult) {
      store.dice.lastResult = finalResult
    }
  }
}

// 停止掷骰子
async function stopRoll() {
  if (!isRolling.value) return
  
  if (dice3DRef.value?.cubeRef) {
    const finalResult = await stopDice(dice3DRef.value.cubeRef)
    if (finalResult) {
      store.dice.lastResult = finalResult
    }
  }
}

// 特效完成回调
function onEffectComplete() {
  console.log('🎲 骰子结果:', result.value, '类型:', diceType.value)
  
  // 触发地图事件
  window.dispatchEvent(new CustomEvent('dice-result', {
    detail: { result: result.value, type: diceType.value }
  }))
  
  // 重置状态
  setTimeout(() => {
    reset()
  }, 500)
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

.dice-wrapper {
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dice-wrapper.shaking {
  animation: shake 0.2s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.dice-info {
  color: #fff;
  text-align: center;
}

.dice-info p {
  margin: 5px 0;
  font-size: 16px;
}

.dice-count {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: bold;
}

.icon {
  font-size: 24px;
}

.last-result span {
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 4px;
}

.last-result span.normal {
  background: rgba(255, 255, 255, 0.2);
}

.last-result span.golden {
  background: rgba(255, 215, 0, 0.3);
  color: #ffd700;
}

.last-result span.attack {
  background: rgba(255, 68, 68, 0.3);
  color: #ff4444;
}

.last-result span.shield {
  background: rgba(68, 136, 255, 0.3);
  color: #4488ff;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
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
  min-width: 150px;
}

.roll-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(76, 175, 80, 0.4);
}

.roll-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.roll-btn.rolling {
  background: linear-gradient(145deg, #ff6b6b, #ee5a5a);
  animation: pulse 0.5s ease infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.dice-type-selector {
  display: flex;
  gap: 10px;
}

.type-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 20px;
}

.type-btn:hover {
  transform: scale(1.1);
}

.type-btn.active {
  border-color: #fff;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

.type-btn.normal.active {
  background: rgba(255, 255, 255, 0.3);
}

.type-btn.golden.active {
  background: rgba(255, 215, 0, 0.3);
}

.type-btn.attack.active {
  background: rgba(255, 68, 68, 0.3);
}

.type-btn.shield.active {
  background: rgba(68, 136, 255, 0.3);
}
</style>
