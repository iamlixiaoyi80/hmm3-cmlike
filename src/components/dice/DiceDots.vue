<template>
  <div class="dice-dots" :class="[`dots-${value}`]">
    <span 
      v-for="i in 9" 
      :key="i" 
      class="dot"
      :class="{ active: isDotActive(i) }"
    ></span>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: Number,
    required: true,
    validator: (v) => v >= 1 && v <= 6
  }
})

// 点阵位置映射（3x3 网格，索引 1-9）
const dotPatterns = {
  1: [5],           // 中心
  2: [1, 9],        // 对角
  3: [1, 5, 9],     // 对角线
  4: [1, 3, 7, 9],  // 四角
  5: [1, 3, 5, 7, 9], // 四角+中心
  6: [1, 3, 4, 6, 7, 9] // 两列
}

function isDotActive(index) {
  const pattern = dotPatterns[arguments[0]] || []
  // 通过 parent 的 value prop 获取
  return false
}
</script>

<script>
export default {
  methods: {
    isDotActive(index) {
      const patterns = {
        1: [5],
        2: [1, 9],
        3: [1, 5, 9],
        4: [1, 3, 7, 9],
        5: [1, 3, 5, 7, 9],
        6: [1, 3, 4, 6, 7, 9]
      }
      return patterns[this.value]?.includes(index) || false
    }
  }
}
</script>

<style scoped>
.dice-dots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 6px;
  width: 70%;
  height: 70%;
  padding: 15%;
}

.dot {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.dot.active {
  background: radial-gradient(circle at 30% 30%, #333, #111);
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
