<template>
  <Transition name="popup">
    <div v-if="visible" class="number-popup" :class="type">
      <span class="number">{{ value }}</span>
      <span v-if="label" class="label">{{ label }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'normal' // normal, golden, attack, shield
  },
  duration: {
    type: Number,
    default: 1500
  }
})

const visible = ref(false)

function show() {
  visible.value = true
  setTimeout(() => {
    visible.value = false
  }, props.duration)
}

// 暴露方法
defineExpose({ show })

// 监听 value 变化自动显示
watch(() => props.value, (newVal) => {
  if (newVal) {
    show()
  }
})
</script>

<style scoped>
.number-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 200;
  pointer-events: none;
}

.number {
  font-size: 72px;
  font-weight: bold;
  text-shadow: 
    0 0 20px currentColor,
    0 4px 8px rgba(0, 0, 0, 0.3);
  color: #fff;
}

.number-popup.normal .number {
  color: #fff;
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 0.8),
    0 4px 8px rgba(0, 0, 0, 0.3);
}

.number-popup.golden .number {
  color: #ffd700;
  text-shadow: 
    0 0 30px rgba(255, 215, 0, 0.9),
    0 4px 8px rgba(0, 0, 0, 0.3);
}

.number-popup.attack .number {
  color: #ff4444;
  text-shadow: 
    0 0 30px rgba(255, 68, 68, 0.9),
    0 4px 8px rgba(0, 0, 0, 0.3);
}

.number-popup.shield .number {
  color: #4488ff;
  text-shadow: 
    0 0 30px rgba(68, 136, 255, 0.9),
    0 4px 8px rgba(0, 0, 0, 0.3);
}

.label {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 5px;
}

/* 动画 */
.popup-enter-active {
  animation: popup-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.popup-leave-active {
  animation: popup-out 0.3s ease-in;
}

@keyframes popup-in {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

@keyframes popup-out {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -80%) scale(0.8);
    opacity: 0;
  }
}
</style>
