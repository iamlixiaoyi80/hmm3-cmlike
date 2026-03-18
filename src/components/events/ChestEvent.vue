<template>
  <div class="event-overlay">
    <div class="event-card">
      <div class="event-icon">🎁</div>
      <h2>发现宝箱！ 选择你的奖励</h2>
      
      <div class="choice-container">
        <button class="choice-btn exp" @click="chooseExp">
          <div class="choice-icon">⚔️</div>
          <div class="choice-label">英雄经验</div>
          <div class="choice-value">+{{ event.exp }}</div>
        </button>
        
        <button class="choice-btn gold" @click="chooseGold">
          <div class="choice-icon">💰</div>
          <div class="choice-label">即时金币</div>
          <div class="choice-value">+{{ event.gold }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../../stores/game'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['complete'])
const gameStore = useGameStore()

const chooseExp = () => {
  gameStore.addExp(props.event.exp)
  emit('complete')
}

const chooseGold = () => {
  gameStore.addResource('gold', props.event.gold)
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
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 300;
}

.event-card {
  background: rgba(255, 140, 0, 0.95);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes bounce-in {
  0% { transform: scale(0) rotate(-10deg); }
  50% { transform: scale(1.1) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.event-icon {
  font-size: 60px;
  margin-bottom: 10px;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}

h2 {
  color: #fff;
  font-size: 24px;
  margin: 0 0 25px 0;
}

.choice-container {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.choice-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 30px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.choice-btn.exp {
  background: linear-gradient(145deg, #4488ff, #2266cc);
  color: #fff;
}

.choice-btn.gold {
  background: linear-gradient(145deg, #FFD700, #FF8C00);
  color: #333;
}

.choice-btn:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.choice-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.choice-label {
  font-size: 14px;
  margin-bottom: 5px;
  opacity: 0.9;
}

.choice-value {
  font-size: 24px;
  font-weight: bold;
}
</style>
