<template>
  <div class="particles-container">
    <div 
      v-for="particle in particles" 
      :key="particle.id"
      class="particle star"
      :style="particle.style"
    >
      ⭐
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  colors: {
    type: Array,
    default: () => ['#ffd700', '#fff', '#ffe066']
  },
  count: {
    type: Number,
    default: 25
  },
  originX: {
    type: Number,
    default: 0.5
  },
  originY: {
    type: Number,
    default: 0.5
  }
})

const particles = ref([])
let particleId = 0

function createParticles() {
  const newParticles = []
  
  for (let i = 0; i < props.count; i++) {
    const angle = (Math.PI * 2 * i) / props.count + Math.random() * 0.8
    const velocity = 80 + Math.random() * 120
    const size = 16 + Math.random() * 16
    const duration = 0.8 + Math.random() * 0.6
    
    newParticles.push({
      id: ++particleId,
      style: {
        left: `${props.originX * 100}%`,
        top: `${props.originY * 100}%`,
        fontSize: `${size}px`,
        '--tx': `${Math.cos(angle) * velocity}px`,
        '--ty': `${Math.sin(angle) * velocity - 60}px`,
        '--rotation': `${Math.random() * 720 - 360}deg`,
        animationDelay: `${Math.random() * 0.15}s`,
        animationDuration: `${duration}s`
      }
    })
  }
  
  particles.value = newParticles
  
  // 动画结束后清除
  setTimeout(() => {
    particles.value = []
  }, 2000)
}

watch(() => props.active, (active) => {
  if (active) {
    createParticles()
  }
})

onMounted(() => {
  if (props.active) {
    createParticles()
  }
})
</script>

<style scoped>
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
  z-index: 100;
}

.particle {
  position: absolute;
  transform: translate(-50%, -50%);
  animation: star-explode var(--duration, 1s) ease-out forwards;
}

.star {
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8));
}

@keyframes star-explode {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) scale(0);
    opacity: 0;
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(0deg) scale(1.2);
  }
  100% {
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--rotation)) scale(0);
    opacity: 0;
  }
}
</style>
