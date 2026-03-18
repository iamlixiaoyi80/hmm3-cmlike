<template>
  <div class="game-container">
    <ResourceBar />
    
    <div class="main-content">
      <MapContainer ref="mapContainerRef" />
      <DicePanel @dice-result="handleDiceResult" />
    </div>
    
    <p class="subtitle">H3-CMlike MVP v0.2.0</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useMapStore } from './stores/map'
import MapContainer from './components/MapContainer.vue'
import DicePanel from './components/DicePanel.vue'
import ResourceBar from './components/ResourceBar.vue'

const mapStore = useMapStore()
const mapContainerRef = ref(null)

onMounted(() => {
  mapStore.initMap(40)
})

const handleDiceResult = ({ result, type }) => {
  console.log('🎲 骰子结果:', result, '类型:', type)
  // MapContainer 会通过 window 事件接收
}
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 10px;
  color: #fff;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.subtitle {
  color: #aaa;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 10px;
}
</style>
