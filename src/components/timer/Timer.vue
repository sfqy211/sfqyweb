<template>
  <div class="card timer-card">
    <h2>⏳ 任务倒计时</h2>
    <div class="timer-controls">
      <input
        type="number"
        v-model="minutes"
        min="1"
        placeholder="分钟"
        class="time-input"
      />
      <button @click="startTimer" :disabled="isRunning" class="timer-btn">
        {{ isRunning ? '计时中...' : '开始' }}
      </button>
      <button @click="resetTimer" class="reset-btn">重置</button>
    </div>
    <div class="time-display">
      {{ formattedTime }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const minutes = ref(5)
const seconds = ref(0)
const isRunning = ref(false)
let timer: number | null = null

const formattedTime = computed(() => {
  const m = Math.floor(seconds.value / 60)
  const s = seconds.value % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

const startTimer = () => {
  if (!isRunning.value) {
    seconds.value = minutes.value * 60
    isRunning.value = true
    timer = setInterval(() => {
      if (seconds.value > 0) {
        seconds.value--
      } else {
        clearInterval(timer!)
        isRunning.value = false
        alert('时间到！')
      }
    }, 1000)
  }
}

const resetTimer = () => {
  clearInterval(timer!)
  isRunning.value = false
  seconds.value = 0
  minutes.value = 5
}
</script>

<style scoped>
.timer-card {
  display: block;
}

.timer-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.time-input {
  width: 50px;
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.timer-btn, .reset-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.timer-btn {
  background: var(--primary-blue);
  color: white;
}

.reset-btn {
  background: #ff4444;
  color: white;
}

.time-display {
  font-size: 3rem;
  font-weight: bold;
  color: var(--primary-blue);
  text-align: center;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .timer-controls {
    flex-direction: column;
  }

  .time-input {
    width: 90%;
  }

  .timer-btn, .reset-btn {
    width: 100%;
    margin-top: 0.5rem;
  }

  .time-display {
    font-size: 2rem;
  }
}
</style> 