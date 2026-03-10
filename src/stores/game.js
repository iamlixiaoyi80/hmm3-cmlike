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
      exp: 0
    }
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
    }
  }
})
