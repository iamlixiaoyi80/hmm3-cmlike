<template>
  <div class="event-overlay">
    <div class="event-card resource">
      <div class="event-icon">💰</div>
      <h2>获得资源！</h2>
      <div class="resource-info">
        <span class="resource-icon">{{ resourceIcon }}</span>
        <span class="resource-amount">+{{ event.amount }}</span>
        <span class="resource-name">{{ resourceName }}</span>
      </div>
      <button class="collect-btn" @click="collect">收集</button>
    </div>
    
    <!-- 金币飞入动画 -->
    <div class="flying-resources">
      <span 
        v-for="i in 10" 
        :key="i" 
        class="flying-coin"
        :style="{ animationDelay: `${i * 0.1}s` }"
      >
        {{ resourceIcon }}
      </span>
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

const resourceIcon = computed(() => {
  const icons = {
    gold: '🪙',
    wood: '🪵',
    ore: '🪨',
    crystal: '💎'
  }
  return icons[props.event.resource] || '💰'
})

const resourceName = computed(() => {
  const names = {
    gold: '金币',
    wood: '木材',
    ore: '矿石',
    crystal: '水晶'
  }
  return names[props.event.resource] || '资源'
})

const collect = () => {
  // 添加资源
  gameStore.addResource(props.event.resource, props.event.amount)
  
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
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.event-card {
  background: linear-gradient(145deg, #2a2a4a, #1a1a2a);
  border-radius: 20px;
  padding: 30px 40px;
  text-align: center;
  animation: card-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.event-card.resource {
  border: 3px solid #FFD700;
}

@keyframes card-pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.event-icon {
  font-size: 60px;
  margin-bottom: 10px;
}

h2 {
  color: #fff;
  font-size: 24px;
  margin: 0 0 20px 0;
}

.resource-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.resource-icon {
  font-size: 40px;
}

.resource-amount {
  font-size: 36px;
  font-weight: bold;
  color: #FFD700;
}

.resource-name {
  font-size: 18px;
  color: #aaa;
}

.collect-btn {
  padding: 12px 40px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(145deg, #FFD700, #FFA500);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.collect-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.4);
}

/* 飞行资源动画 */
.flying-resources {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.flying-coin {
  position: absolute;
  font-size: 24px;
  animation: fly-up 1s ease-out forwards;
}

@keyframes fly-up {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx, 0), -100px) scale(0.5);
    opacity: 0;
  }
}

.flying-coin:nth-child(1) { --tx: -50px; }
.flying-coin:nth-child(2) { --tx: 50px; }
.flying-coin:nth-child(3) { --tx: -30px; }
.flying-coin:nth-child(4) { --tx: 30px; }
.flying-coin:nth-child(5) { --tx: -70px; }
.flying-coin:nth-child(6) { --tx: 70px; }
.flying-coin:nth-child(7) { --tx: -10px; }
.flying-coin:nth-child(8) { --tx: 10px; }
.flying-coin:nth-child(9) { --tx: -90px; }
.flying-coin:nth-child(10) { --tx: 90px; }
</style>
