<template>
  <div class="event-overlay">
    <div class="event-card" :class="rarityClass">
      <div class="event-icon">💎</div>
      <h2>发现宝物！</h2>
      <div class="treasure-info">
        <span class="treasure-rarity">{{ rarityName }}</span>
        <span class="treasure-name">神秘宝物</span>
      </div>
      
      <!-- 宝物光芒效果 -->
      <div class="treasure-glow" :class="rarityClass"></div>
      
      <button class="collect-btn" @click="collect">
        收入囊中
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

const rarityClass = computed(() => `rarity-${props.event.rarity}`)

const rarityName = computed(() => {
  const names = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
  }
  return names[props.event.rarity] || '普通'
})

const collect = () => {
  // 添加宝物
  gameStore.addTreasure(props.event.rarity)
  
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
  z-index: 300;
}

.event-card {
  position: relative;
  background: linear-gradient(145deg, #2a2a4a, #1a1a2a);
  border-radius: 20px;
  padding: 30px 40px;
  text-align: center;
  animation: card-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

/* 稀有度边框 */
.event-card.rarity-common { border: 3px solid #888; }
.event-card.rarity-rare { border: 3px solid #4488ff; }
.event-card.rarity-epic { border: 3px solid #aa44ff; }
.event-card.rarity-legendary { border: 3px solid #ff8800; }

@keyframes card-pop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.event-icon {
  font-size: 60px;
  margin-bottom: 10px;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(360deg); }
}

h2 {
  color: #fff;
  font-size: 24px;
  margin: 0 0 20px 0;
}

.treasure-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.treasure-rarity {
  font-size: 20px;
  font-weight: bold;
}

.rarity-common .treasure-rarity { color: #888; }
.rarity-rare .treasure-rarity { color: #4488ff; }
.rarity-epic .treasure-rarity { color: #aa44ff; }
.rarity-legendary .treasure-rarity { 
  color: #ff8800;
  animation: pulse 1s ease infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.treasure-name {
  font-size: 16px;
  color: #aaa;
}

/* 宝物光芒效果 */
.treasure-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0.3;
  animation: glow-rotate 5s linear infinite;
}

.treasure-glow.rarity-rare {
  background: radial-gradient(circle, rgba(68, 136, 255, 0.3) 0%, transparent 70%);
}

.treasure-glow.rarity-epic {
  background: radial-gradient(circle, rgba(170, 68, 255, 0.3) 0%, transparent 70%);
}

.treasure-glow.rarity-legendary {
  background: radial-gradient(circle, rgba(255, 136, 0, 0.4) 0%, transparent 70%);
  animation: glow-rotate 3s linear infinite;
}

@keyframes glow-rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.collect-btn {
  padding: 12px 40px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(145deg, #9400D3, #7B00D3);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  z-index: 1;
}

.collect-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(148, 0, 211, 0.4);
}
</style>
