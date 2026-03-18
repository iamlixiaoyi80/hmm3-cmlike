<template>
  <div class="dice-scene" @click="$emit('click')">
    <div 
      class="dice-cube"
      ref="cubeRef"
      :class="[state, type]"
      :style="cubeStyle"
    >
      <!-- 6个面 -->
      <div 
        v-for="face in faces" 
        :key="face.value"
        class="dice-face"
        :class="`face-${face.value}`"
        :style="face.style"
      >
        <DiceDots :value="face.value" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import DiceDots from './DiceDots.vue'

const props = defineProps({
  state: {
    type: String,
    default: 'idle'
  },
  type: {
    type: String,
    default: 'normal' // normal, golden, attack, shield
  },
  result: {
    type: Number,
    default: null
  }
})

defineEmits(['click'])

const cubeRef = ref(null)
const rotationX = ref(0)
const rotationY = ref(0)

// 6个面的配置
const faces = [
  { value: 1, style: { transform: 'rotateY(0deg) translateZ(50px)' } },
  { value: 6, style: { transform: 'rotateY(180deg) translateZ(50px)' } },
  { value: 3, style: { transform: 'rotateY(90deg) translateZ(50px)' } },
  { value: 4, style: { transform: 'rotateY(-90deg) translateZ(50px)' } },
  { value: 2, style: { transform: 'rotateX(90deg) translateZ(50px)' } },
  { value: 5, style: { transform: 'rotateX(-90deg) translateZ(50px)' } }
]

// 面的角度映射（数字 -> CSS 3D 变换）
const faceRotations = {
  1: { x: 0, y: 0 },
  6: { x: 0, y: 180 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  2: { x: -90, y: 0 },
  5: { x: 90, y: 0 }
}

// 计算立方体样式
const cubeStyle = computed(() => ({
  transform: `rotateX(${rotationX.value}deg) rotateY(${rotationY.value}deg)`
}))

// 监听结果变化
watch(() => props.result, (newResult) => {
  if (newResult && faceRotations[newResult]) {
    rotationX.value = faceRotations[newResult].x
    rotationY.value = faceRotations[newResult].y
  }
})

// 暴露方法给父组件
defineExpose({
  cubeRef,
  setRotation: (x, y) => {
    rotationX.value = x
    rotationY.value = y
  }
})
</script>

<style scoped>
.dice-scene {
  width: 120px;
  height: 120px;
  perspective: 600px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dice-cube {
  width: 100px;
  height: 100px;
  position: relative;
  transform-style: preserve-3d;
  transform-origin: center center;
  transition: transform 0.1s ease;
}

/* 骰子类型样式 */
.dice-cube.normal .dice-face {
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.5);
}

.dice-cube.golden .dice-face {
  background: linear-gradient(145deg, #ffd700, #ff8c00);
  box-shadow: 
    inset 0 0 20px rgba(255, 215, 0, 0.5),
    0 0 30px rgba(255, 215, 0, 0.6);
}

.dice-cube.attack .dice-face {
  background: linear-gradient(145deg, #ff4444, #cc0000);
  box-shadow: 
    inset 0 0 20px rgba(255, 68, 68, 0.5),
    0 0 30px rgba(255, 68, 68, 0.6);
}

.dice-cube.shield .dice-face {
  background: linear-gradient(145deg, #4488ff, #0044cc);
  box-shadow: 
    inset 0 0 20px rgba(68, 136, 255, 0.5),
    0 0 30px rgba(68, 136, 255, 0.6);
}

.dice-face {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 15px;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

/* 滚动状态 */
.dice-cube.rolling {
  animation: glow 0.3s ease infinite alternate;
}

@keyframes glow {
  from {
    filter: brightness(1);
  }
  to {
    filter: brightness(1.3);
  }
}

/* 停止状态 */
.dice-cube.stopping {
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 落地状态 */
.dice-cube.landed {
  animation: bounce 0.3s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* 结果状态 */
.dice-cube.result {
  animation: pulse 0.5s ease infinite alternate;
}

@keyframes pulse {
  from {
    filter: brightness(1);
  }
  to {
    filter: brightness(1.2);
  }
}
</style>
