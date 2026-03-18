<template>
  <div class="dice-effects">
    <!-- 粒子爆炸 -->
    <Particles 
      :active="showParticles" 
      :colors="particleColors"
      :count="particleCount"
      @animationend="showParticles = false"
    />
    
    <!-- 数字弹出 -->
    <NumberPopup 
      ref="popupRef"
      :value="result || 0"
      :type="type"
      :label="resultLabel"
    />
    
    <!-- 屏幕震动层 -->
    <div v-if="isShaking" class="screen-shake"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Particles from './Particles.vue'
import NumberPopup from './NumberPopup.vue'

const props = defineProps({
  state: {
    type: String,
    default: 'idle'
  },
  result: {
    type: Number,
    default: null
  },
  type: {
    type: String,
    default: 'normal'
  }
})

const emit = defineEmits(['effect-complete'])

const showParticles = ref(false)
const isShaking = ref(false)
const popupRef = ref(null)

// 粒子颜色配置
const colorConfig = {
  normal: ['#ffffff', '#f0f0f0', '#cccccc', '#aaaaaa'],
  golden: ['#ffd700', '#ffaa00', '#ff8800', '#ffcc00'],
  attack: ['#ff4444', '#ff6666', '#ff0000', '#ff8888'],
  shield: ['#4488ff', '#66aaff', '#0066ff', '#88ccff']
}

const particleColors = computed(() => colorConfig[props.type] || colorConfig.normal)
const particleCount = computed(() => props.type === 'golden' ? 40 : 30)

// 结果标签
const resultLabel = computed(() => {
  const labels = {
    normal: '',
    golden: '双倍收益!',
    attack: '触发攻击!',
    shield: '防御加成!'
  }
  return labels[props.type] || ''
})

// 触发特效
function triggerEffects() {
  // 粒子爆炸
  showParticles.value = true
  
  // 屏幕震动
  isShaking.value = true
  setTimeout(() => {
    isShaking.value = false
  }, 300)
  
  // 数字弹出
  if (popupRef.value) {
    popupRef.value.show()
  }
  
  // 完成回调
  setTimeout(() => {
    emit('effect-complete')
  }, 1500)
}

// 监听状态变化
watch(() => props.state, (newState) => {
  if (newState === 'landed') {
    triggerEffects()
  }
})

// 暴露方法
defineExpose({
  triggerEffects
})
</script>

<style scoped>
.dice-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 50;
}

.screen-shake {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  animation: shake 0.3s ease;
  pointer-events: none;
  z-index: 1000;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
</style>
