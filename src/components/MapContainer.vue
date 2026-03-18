<template>
  <div class="map-container" ref="containerRef">
    <div ref="phaserRef" class="phaser-canvas"></div>
    
    <!-- 事件弹窗层 -->
    <Transition name="fade" mode="out-in">
      <component 
        :is="getEventComponent" 
        v-if="currentEvent"
        :event="currentEvent.data"
        @complete="onEventComplete"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, shallowRef, markRaw } from 'vue'
import Phaser from 'phaser'
import { useMapStore, TileType } from '../stores/map'
import { useGameStore } from '../stores/game'
import ResourceEvent from './events/ResourceEvent.vue'
import CreatureEvent from './events/CreatureEvent.vue'
import TreasureEvent from './events/TreasureEvent.vue'
import ChestEvent from './events/ChestEvent.vue'

const containerRef = ref(null)
const phaserRef = ref(null)
const game = shallowRef(null)
const mapScene = shallowRef(null)

const mapStore = useMapStore()
const gameStore = useGameStore()

const currentEvent = computed(() => mapStore.lastEvent)

// 获取事件组件
const getEventComponent = computed(() => {
  if (!currentEvent.value) return null
  
  const components = {
    resource: markRaw(ResourceEvent),
    creature: markRaw(CreatureEvent),
    treasure: markRaw(TreasureEvent),
    chest: markRaw(ChestEvent)
  }
  
  return components[currentEvent.value.type] || null
})

// Phaser 场景类
class MapSceneClass extends Phaser.Scene {
  constructor() {
    super({ key: 'MapScene' })
    this.tileGraphics = []
    this.tileTexts = []
    this.highlightIndicator = null
  }
  
  create() {
    this.cameras.main.setBackgroundColor('#1a1a2a')
    this.createTiles()
    this.createHighlightIndicator()
  }
  
  createTiles() {
    const mapStore = this.game.registry.get('mapStore')
    if (!mapStore) return
    
    const tiles = mapStore.tiles
    const mapSize = tiles.length
    
    const centerX = this.cameras.main.width / 2
    const centerY = this.cameras.main.height / 2
    const radiusX = Math.min(centerX - 80, 300)
    const radiusY = Math.min(centerY - 60, 200)
    
    const colors = {
      [TileType.CASTLE]: 0x8B4513,
      [TileType.RESOURCE]: 0xFFD700,
      [TileType.CREATURE]: 0x32CD32,
      [TileType.TREASURE]: 0x9400D3,
      [TileType.CHEST]: 0xFF8C00,
      [TileType.ATTACK]: 0xFF4444,
      [TileType.SPECIAL]: 0x00CED1,
      [TileType.EMPTY]: 0x666666
    }
    
    const icons = {
      [TileType.CASTLE]: '🏰',
      [TileType.RESOURCE]: '💰',
      [TileType.CREATURE]: '🐉',
      [TileType.TREASURE]: '💎',
      [TileType.CHEST]: '🎁',
      [TileType.ATTACK]: '⚔️',
      [TileType.SPECIAL]: '✨',
      [TileType.EMPTY]: '·'
    }
    
    for (let i = 0; i < mapSize; i++) {
      const angle = (i / mapSize) * Math.PI * 2 - Math.PI / 2
      const x = centerX + Math.cos(angle) * radiusX
      const y = centerY + Math.sin(angle) * radiusY
      
      const tile = tiles[i]
      const graphics = this.add.graphics()
      const color = colors[tile.type] || 0x666666
      const size = 50
      
      // 绘制地格
      graphics.fillStyle(0x000000, 0.3)
      graphics.fillRoundedRect(x - size/2 + 3, y - size/2 + 3, size, size, 8)
      graphics.fillStyle(color, 1)
      graphics.fillRoundedRect(x - size/2, y - size/2, size, size, 8)
      
      if (i === 0) {
        graphics.lineStyle(3, 0xFFFFFF, 1)
        graphics.strokeRoundedRect(x - size/2, y - size/2, size, size, 8)
      }
      
      graphics.tileData = { id: i, x, y, type: tile.type }
      this.tileGraphics.push(graphics)
      
      const icon = this.add.text(x, y, icons[tile.type] || '·', {
        fontSize: '18px'
      }).setOrigin(0.5)
      this.tileTexts.push(icon)
    }
  }
  
  createHighlightIndicator() {
    this.highlightIndicator = this.add.graphics()
    this.highlightIndicator.setVisible(false)
  }
  
  highlightTile(tileId) {
    if (tileId < 0 || tileId >= this.tileGraphics.length) return Promise.resolve()
    
    const tileGraphic = this.tileGraphics[tileId]
    const { x, y } = tileGraphic.tileData
    
    this.highlightIndicator.clear()
    this.highlightIndicator.setVisible(true)
    this.highlightIndicator.lineStyle(4, 0xFFFFFF, 1)
    this.highlightIndicator.strokeCircle(x, y, 35)
    
    return new Promise(resolve => {
      this.tweens.add({
        targets: this.highlightIndicator,
        scaleX: 1.2,
        scaleY: 1.2,
        alpha: 0.5,
        duration: 300,
        yoyo: true,
        repeat: 2,
        onComplete: resolve
      })
    })
  }
  
  hideHighlight() {
    if (this.highlightIndicator) {
      this.highlightIndicator.setVisible(false)
    }
  }
}

// 初始化 Phaser
const initPhaser = () => {
  if (!phaserRef.value) return
  
  const config = {
    type: Phaser.AUTO,
    parent: phaserRef.value,
    width: phaserRef.value.clientWidth || 800,
    height: phaserRef.value.clientHeight || 500,
    backgroundColor: '#1a1a2a',
    scene: [MapSceneClass]
  }
  
  game.value = new Phaser.Game(config)
  game.value.registry.set('mapStore', mapStore)
  
  game.value.events.on('ready', () => {
    mapScene.value = game.value.scene.getScene('MapScene')
  })
}

// 监听骰子结果
const handleDiceResult = async (e) => {
  const { result } = e.detail || e
  if (!mapScene.value) return
  
  // 移动玩家
  const tile = mapStore.movePlayer(result)
  
  // 高亮地格
  await mapScene.value.highlightTile(tile.id)
  
  // 触发事件
  if (tile.event) {
    mapStore.triggerEvent(tile)
  }
}

// 事件完成回调
const onEventComplete = () => {
  mapStore.clearEvent()
  if (mapScene.value) {
    mapScene.value.hideHighlight()
  }
}

// 监听窗口大小变化
const handleResize = () => {
  if (game.value && phaserRef.value) {
    game.value.scale.resize(
      phaserRef.value.clientWidth || 800,
      phaserRef.value.clientHeight || 500
    )
  }
}

onMounted(() => {
  mapStore.initMap(40)
  initPhaser()
  window.addEventListener('resize', handleResize)
  window.addEventListener('dice-result', handleDiceResult)
})

onUnmounted(() => {
  if (game.value) {
    game.value.destroy(true)
  }
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('dice-result', handleDiceResult)
})

defineExpose({
  handleDiceResult
})
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 300px;
  background: #1a1a2a;
  border-radius: 15px;
  overflow: hidden;
}

.phaser-canvas {
  width: 100%;
  height: 100%;
}

.phaser-canvas canvas {
  display: block;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
