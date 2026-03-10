<template>
  <div class="game-container">
    <ResourceBar />
    <DicePanel />
    <p class="subtitle">H3-CMlike MVP v0.1.0</p>
  </div>
</template>

<script setup>
import DicePanel from './components/DicePanel.vue'
import ResourceBar from './components/ResourceBar.vue'
</script>

<style scoped>
.game-container {
  text-align: center;
  padding: 20px;
  color: #fff;
}

h1 {
  font-size: 2.5rem;
  background: linear-gradient(45deg, #ffd700, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.subtitle {
  color: #aaa;
  font-size: 1rem;
}
</style>
