<template>
  <div class="resource-bar">
    <div class="resource-item gold">
      <span class="icon">💰</span>
      <span class="value">{{ resources.gold }}</span>
    </div>
    <div class="resource-item wood">
      <span class="icon">🪵</span>
      <span class="value">{{ resources.wood }}</span>
    </div>
    <div class="resource-item ore">
      <span class="icon">⛏️</span>
      <span class="value">{{ resources.ore }}</span>
    </div>
    <div class="resource-item crystal">
      <span class="icon">💎</span>
      <span class="value">{{ resources.crystal }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/game'

const store = useGameStore()
const resources = computed(() => store.resources)
</script>

<style scoped>
.resource-bar {
  display: flex;
  gap: 20px;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.icon {
  font-size: 20px;
}

.value {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  min-width: 60px;
}

.gold .value { color: #ffd700; }
.wood .value { color: #8B4513; }
.ore .value { color: #888; }
.crystal .value { color: #00ffff; }
</style>
