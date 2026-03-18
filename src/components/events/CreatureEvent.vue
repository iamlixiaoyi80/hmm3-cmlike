<template>
  <div class="event-overlay creature-event">
    <div class="event-card">
      <div class="event-icon">🐉</div>
      <h2>发现生物！</h2>
      <div class="creature-info">
        <span class="creature-name">{{ creatureName }}</span>
        <span class="creature-count">×{{ event.count }}</span>
      </div>
      
      <!-- 生物图标展示 -->
      <div class="creature-display">
        <div 
          v-for="i in event.count" 
          :key="i" 
          class="creature-unit"
          :style="{ animationDelay: `${i * 0.15}s` }"
        >
          🐉
        </div>
      </div>
      
      <button class="collect-btn" @click="collect">
        收编部队
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../../stores/game'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['complete'])
const gameStore = useGameStore()

const creatureName = computed(() => {
  const names = {
    angel: '天使',
    devil: '恶魔',
    dragon: '龙',
    knight: '骑士',
    archer: '弓箭手'
  }
  return names[props.event.creature] || '生物'
})

const collect = () => {
  // 添加生物
  gameStore.addCreature(props.event.creature, props.event.count)
  
  // 完成事件
  emit('complete')
}
</script>

<style scoped>
.event-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 300;
}

.event-card {
  background: rgba(50, 205, 50, 0.95);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  min-width: 300px;
  animation: pop-in 0.3s ease;
}

@keyframes pop-in {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.event-icon {
  font-size: 60px;
  margin-bottom: 10px;
}

h2 {
  color: #fff;
  font-size: 24px;
  margin: 0;
}

.creature-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.creature-name {
  font-size: 28px;
  font-weight: bold;
  color: #32CD32;
}

.creature-count {
  font-size: 20px;
  color: #aaa;
}

.creature-display {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.creature-unit {
  font-size: 30px;
  animation: bounce 0.3s ease;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.collect-btn {
  padding: 12px 30px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(145deg, #32CD32, #228B22);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.collect-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(50, 205, 50, 0.4);
}
</style>
