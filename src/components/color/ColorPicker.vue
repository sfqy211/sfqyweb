<template>
  <div class="card color-card">
    <h2>🎨 颜色查询</h2>
    <div class="color-picker-container">
      <input type="color" v-model="selectedColor" class="color-picker" />
    </div>
    <div class="color-code-display">
      <div class="code-item">
        <label>HEX:</label>
        <span>{{ selectedColor }}</span>
      </div>
      <div class="code-item">
        <label>RGB:</label>
        <span>{{ rgbColor }}</span>
      </div>
      <div class="code-item">
        <label>HSL:</label>
        <span>{{ hslColor }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const selectedColor = ref('#ffffff')

const rgbColor = computed(() => {
  const hex = selectedColor.value.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgb(${r}, ${g}, ${b})`
})

const hslColor = computed(() => {
  const hex = selectedColor.value.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    h = 0
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)
  return `hsl(${h}, ${s}%, ${l}%)`
})
</script>

<style scoped>
.color-card {
  display: block;
}

.color-picker-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.color-picker {
  width: 100px;
  height: 100px;
  border: none;
  background: none;
  cursor: pointer;
}

.color-code-display {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.code-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.355);
  border-radius: 4px;
  font-size: 0.9em;
  color: white;
}

.code-item label {
  font-weight: bold;
}
</style> 