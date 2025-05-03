<template>
  <div class="dock-container">
    <div class="dock">
      <div 
        v-for="(item, index) in dockItems" 
        :key="index"
        class="dock-item"
        :class="{ active: activeTab === item.id }"
        @click="handleClick(item.id)"
      >
        <span class="dock-icon">{{ item.icon }}</span>
        <span class="dock-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  activeTab: string
}>()

const emit = defineEmits<{
  (e: 'tab-change', tab: string): void
}>()

const dockItems = [
  { id: 'timer', icon: '⏱️', label: '计时器' },
  { id: 'color', icon: '🎨', label: '颜色选择器' },
  { id: 'calculator', icon: '🧮', label: '计算器' },
  { id: 'password', icon: '🔑', label: '密码生成器' },
  { id: 'whatPassword', icon: '🎮', label: '猜密码' }
]

const handleClick = (tab: string) => {
  emit('tab-change', tab)
}
</script>

<style scoped>
.dock-container {
  position: fixed;
  bottom: 80px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 1000;
}

.dock {
  display: flex;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 10px;
}

.dock-item:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.dock-item.active {
  background: rgba(0, 0, 0, 0.2);
}

.dock-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.dock-label {
  font-size: 12px;
  color: #333;
}

@media (max-width: 768px) {
  .dock-container {
    bottom: 0;
    left: auto;
    right: 0;
    width: auto;
    height: 100%;
    flex-direction: column;
  }

  .dock {
    flex-direction: column;
    height: 100%;
    padding: 10px 0;
  }

  .dock-item {
    padding: 12px 8px;
  }
}
</style> 