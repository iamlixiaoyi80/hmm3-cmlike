import { ref, computed } from 'vue'
import { gsap } from 'gsap'

// 骰子状态枚举
export const DiceState = {
  IDLE: 'idle',
  THROWING: 'throwing',
  ROLLING: 'rolling',
  STOPPING: 'stopping',
  LANDED: 'landed',
  RESULT: 'result'
}

// 骰子类型
export const DiceType = {
  NORMAL: 'normal',
  GOLDEN: 'golden',
  ATTACK: 'attack',
  SHIELD: 'shield'
}

// 骰子类型配置
export const diceTypeConfig = {
  [DiceType.NORMAL]: {
    color: '#ffffff',
    gradient: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
    glow: 'rgba(255, 255, 255, 0.5)',
    particleColors: ['#ffffff', '#f0f0f0', '#e0e0e0']
  },
  [DiceType.GOLDEN]: {
    color: '#ffd700',
    gradient: 'linear-gradient(145deg, #ffd700, #ff8c00)',
    glow: 'rgba(255, 215, 0, 0.8)',
    particleColors: ['#ffd700', '#ffaa00', '#ff8800']
  },
  [DiceType.ATTACK]: {
    color: '#ff4444',
    gradient: 'linear-gradient(145deg, #ff4444, #cc0000)',
    glow: 'rgba(255, 68, 68, 0.8)',
    particleColors: ['#ff4444', '#ff6666', '#ff0000']
  },
  [DiceType.SHIELD]: {
    color: '#4488ff',
    gradient: 'linear-gradient(145deg, #4488ff, #0044cc)',
    glow: 'rgba(68, 136, 255, 0.8)',
    particleColors: ['#4488ff', '#66aaff', '#0066ff']
  }
}

export function useDiceAnimation() {
  const state = ref(DiceState.IDLE)
  const result = ref(null)
  const diceType = ref(DiceType.NORMAL)
  
  // 旋转角度（用于显示不同面）
  const rotationX = ref(0)
  const rotationY = ref(0)
  
  // 面的角度映射（数字 -> CSS 3D 变换）
  const faceRotations = {
    1: { x: 0, y: 0 },
    2: { x: 0, y: 180 },
    3: { x: 0, y: -90 },
    4: { x: 0, y: 90 },
    5: { x: 90, y: 0 },
    6: { x: -90, y: 0 }
  }
  
  // 计算当前状态
  const isRolling = computed(() => state.value === DiceState.ROLLING)
  const isAnimating = computed(() => state.value !== DiceState.IDLE)
  
  // 掷骰子
  async function throwDice(diceElement) {
    if (state.value !== DiceState.IDLE) return null
    
    state.value = DiceState.THROWING
    result.value = null
    
    // 随机生成最终结果
    const finalResult = Math.floor(Math.random() * 6) + 1
    const targetRotation = faceRotations[finalResult]
    
    // 计算旋转圈数（增加随机性）
    const extraRotationsX = 720 + Math.floor(Math.random() * 360)
    const extraRotationsY = 720 + Math.floor(Math.random() * 360)
    
    // 阶段1：飞出动画
    await gsap.to(diceElement, {
      y: -150,
      scale: 1.3,
      duration: 0.3,
      ease: 'power2.out'
    })
    
    state.value = DiceState.ROLLING
    
    // 阶段2：旋转动画
    gsap.to(diceElement, {
      y: 0,
      scale: 1,
      rotationX: targetRotation.x + extraRotationsX,
      rotationY: targetRotation.y + extraRotationsY,
      duration: 2,
      ease: 'power1.out'
    })
    
    // 等待旋转完成
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    state.value = DiceState.STOPPING
    
    // 阶段3：定格动画
    await gsap.to(diceElement, {
      scale: 1.2,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    })
    
    state.value = DiceState.LANDED
    result.value = finalResult
    
    // 震动反馈
    vibrate('medium')
    
    return finalResult
  }
  
  // 停止骰子（提前停止）
  async function stopDice(diceElement) {
    if (state.value !== DiceState.ROLLING) return null
    
    // 停止当前动画
    gsap.killTweensOf(diceElement)
    
    // 随机结果
    const finalResult = Math.floor(Math.random() * 6) + 1
    const targetRotation = faceRotations[finalResult]
    
    // 快速过渡到结果
    await gsap.to(diceElement, {
      rotationX: targetRotation.x + 360,
      rotationY: targetRotation.y + 360,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'back.out(1.7)'
    })
    
    state.value = DiceState.LANDED
    result.value = finalResult
    
    // 震动反馈
    vibrate('medium')
    
    return finalResult
  }
  
  // 显示结果
  function showResult() {
    if (state.value === DiceState.LANDED) {
      state.value = DiceState.RESULT
    }
  }
  
  // 重置
  function reset() {
    state.value = DiceState.IDLE
    result.value = null
  }
  
  // 设置骰子类型
  function setDiceType(type) {
    diceType.value = type
  }
  
  // 震动反馈
  function vibrate(intensity = 'light') {
    if (!('vibrate' in navigator)) return
    
    const patterns = {
      light: 30,
      medium: 60,
      strong: [100, 30, 100]
    }
    
    try {
      navigator.vibrate(patterns[intensity] || patterns.light)
    } catch (e) {
      // iOS 不支持，静默失败
    }
  }
  
  return {
    state,
    result,
    diceType,
    rotationX,
    rotationY,
    isRolling,
    isAnimating,
    throwDice,
    stopDice,
    showResult,
    reset,
    setDiceType,
    vibrate,
    diceTypeConfig
  }
}
