import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 地格类型
export const TileType = {
  RESOURCE: 'resource',
  CREATURE: 'creature',
  TREASURE: 'treasure',
  CHEST: 'chest',
  ATTACK: 'attack',
  SPECIAL: 'special',
  EMPTY: 'empty',
  CASTLE: 'castle'
}

// 资源类型
export const ResourceType = {
  GOLD: 'gold',
  WOOD: 'wood',
  ORE: 'ore',
  CRYSTAL: 'crystal'
}

// 宝物稀有度
export const TreasureRarity = {
  COMMON: 'common',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
}

// 生成地图数据
function generateMapData(size = 40) {
  const tiles = []
  
  // 概率分布
  const distribution = [
    { type: TileType.RESOURCE, weight: 25 },
    { type: TileType.CREATURE, weight: 15 },
    { type: TileType.TREASURE, weight: 10 },
    { type: TileType.CHEST, weight: 10 },
    { type: TileType.ATTACK, weight: 15 },
    { type: TileType.SPECIAL, weight: 10 },
    { type: TileType.EMPTY, weight: 15 }
  ]
  
  // 计算累积权重
  const totalWeight = distribution.reduce((sum, d) => sum + d.weight, 0)
  const cumulative = []
  let acc = 0
  for (const d of distribution) {
    acc += d.weight
    cumulative.push({ type: d.type, threshold: acc / totalWeight })
  }
  
  // 生成地格
  for (let i = 0; i < size; i++) {
    // 起点是城堡
    if (i === 0) {
      tiles.push({
        id: i,
        type: TileType.CASTLE,
        event: null
      })
      continue
    }
    
    // 随机类型
    const rand = Math.random()
    const tileType = cumulative.find(c => rand < c.threshold)?.type || TileType.EMPTY
    
    // 生成事件
    const event = generateEvent(tileType)
    
    tiles.push({
      id: i,
      type: tileType,
      event
    })
  }
  
  return tiles
}

// 生成事件数据
function generateEvent(tileType) {
  switch (tileType) {
    case TileType.RESOURCE:
      const resources = [
        { resource: ResourceType.GOLD, amount: [100, 200, 300, 500] },
        { resource: ResourceType.WOOD, amount: [50, 100, 150] },
        { resource: ResourceType.ORE, amount: [30, 50, 80] },
        { resource: ResourceType.CRYSTAL, amount: [10, 20, 30] }
      ]
      const res = resources[Math.floor(Math.random() * resources.length)]
      return {
        resource: res.resource,
        amount: res.amount[Math.floor(Math.random() * res.amount.length)]
      }
    
    case TileType.CREATURE:
      const creatures = [
        { creature: 'angel', count: [1, 2, 3] },
        { creature: 'devil', count: [1, 2] },
        { creature: 'dragon', count: [1] },
        { creature: 'knight', count: [3, 5, 8] },
        { creature: 'archer', count: [5, 10, 15] }
      ]
      const cre = creatures[Math.floor(Math.random() * creatures.length)]
      return {
        creature: cre.creature,
        count: cre.count[Math.floor(Math.random() * cre.count.length)]
      }
    
    case TileType.TREASURE:
      const rarities = [
        { rarity: TreasureRarity.COMMON, weight: 50 },
        { rarity: TreasureRarity.RARE, weight: 30 },
        { rarity: TreasureRarity.EPIC, weight: 15 },
        { rarity: TreasureRarity.LEGENDARY, weight: 5 }
      ]
      const totalR = rarities.reduce((s, r) => s + r.weight, 0)
      let accR = 0
      const randR = Math.random() * totalR
      let selectedRarity = TreasureRarity.COMMON
      for (const r of rarities) {
        accR += r.weight
        if (randR < accR) {
          selectedRarity = r.rarity
          break
        }
      }
      return { rarity: selectedRarity }
    
    case TileType.CHEST:
      return {
        exp: [300, 500, 800, 1000][Math.floor(Math.random() * 4)],
        gold: [1000, 1500, 2000, 3000][Math.floor(Math.random() * 4)]
      }
    
    case TileType.ATTACK:
      return { type: 'pvp' }
    
    case TileType.SPECIAL:
      const specials = ['teleport', 'shield', 'magic', 'double_dice']
      return { effect: specials[Math.floor(Math.random() * specials.length)] }
    
    default:
      return null
  }
}

export const useMapStore = defineStore('map', () => {
  // 状态
  const tiles = ref([])
  const playerPosition = ref(0)
  const currentTile = ref(null)
  const isAnimating = ref(false)
  const lastEvent = ref(null)
  
  // 计算属性
  const currentTileData = computed(() => tiles.value[playerPosition.value])
  const mapSize = computed(() => tiles.value.length)
  
  // 初始化地图
  function initMap(size = 40) {
    tiles.value = generateMapData(size)
    playerPosition.value = 0
    currentTile.value = tiles.value[0]
  }
  
  // 移动玩家
  function movePlayer(steps) {
    const newPosition = (playerPosition.value + steps) % tiles.value.length
    playerPosition.value = newPosition
    currentTile.value = tiles.value[newPosition]
    return currentTile.value
  }
  
  // 触发事件
  function triggerEvent(tile) {
    if (!tile || !tile.event) return null
    
    lastEvent.value = {
      type: tile.type,
      data: tile.event,
      tileId: tile.id
    }
    
    return lastEvent.value
  }
  
  // 清除事件
  function clearEvent() {
    lastEvent.value = null
  }
  
  // 设置动画状态
  function setAnimating(value) {
    isAnimating.value = value
  }
  
  return {
    // 状态
    tiles,
    playerPosition,
    currentTile,
    isAnimating,
    lastEvent,
    
    // 计算属性
    currentTileData,
    mapSize,
    
    // 方法
    initMap,
    movePlayer,
    triggerEvent,
    clearEvent,
    setAnimating
  }
})
