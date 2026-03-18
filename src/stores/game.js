import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    // 骰子相关
    dice: {
      count: 50,
      maxCount: 50,
      lastResult: 0,
      isRolling: false
    },
    
    // 资源
    resources: {
      gold: 1000,
      wood: 500,
      ore: 300,
      crystal: 100
    },
    
    // 玩家信息
    player: {
      name: '玩家',
      level: 1,
      exp: 0,
      expToNext: 1000
    },
    
    // 生物
    creatures: {},
    
    // 宝物
    treasures: []
  }),
  
  actions: {
    // 掷骰子
    rollDice() {
      this.dice.isRolling = true
      this.dice.lastResult = Math.floor(Math.random() * 6) + 1
    },
    
    // 停止骰子
    stopDice() {
      this.dice.isRolling = false
      this.dice.count--
    },
    
    // 添加资源
    addResource(type, amount) {
      this.resources[type] += amount
    },
    
    // 消耗骰子
    useDice(count) {
      this.dice.count = Math.max(0, this.dice.count - count)
    },
    
    // 恢复骰子
    restoreDice(count) {
      this.dice.count = Math.min(this.dice.maxCount, this.dice.count + count)
    },
    
    // 添加经验
    addExp(amount) {
      this.player.exp += amount
      // 检查升级
      while (this.player.exp >= this.player.expToNext) {
        this.player.exp -= this.player.expToNext
        this.player.level++
        this.player.expToNext = Math.floor(this.player.expToNext * 1.5)
      }
    },
    
    // 添加生物
    addCreature(type, count) {
      if (!this.creatures[type]) {
        this.creatures[type] = 0
      }
      this.creatures[type] += count
    },
    
    // 添加宝物
    addTreasure(rarity) {
      this.treasures.push({
        id: Date.now(),
        rarity,
        obtainedAt: new Date().toISOString()
      })
    }
  }
})
