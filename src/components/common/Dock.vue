<template>
  <div class="dock-container">
    <div class="dock" :class="{ 'collapsed': isCollapsed }">
      <div 
        v-for="(item, index) in dockItems" 
        :key="index"
        class="dock-item"
        @click="handleClick(item.id)"
      >
        <span class="dock-icon">{{ item.icon }}</span>
        <span class="dock-label">{{ item.label }}</span>
      </div>
    </div>
    
    <!-- 通用折叠按钮 -->
    <div class="toggle-button" @click="toggleDock">
      <span class="toggle-icon">{{ isCollapsed ? '➕' : '✖️' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  (e: 'tab-change', tab: string): void
}>()

const dockItems = [
  { id: 'timer', icon: '⏱️', label: '计时器' },
  { id: 'color', icon: '🎨', label: '颜色选择器' },
  { id: 'calculator', icon: '🧮', label: '计算器' },
  { id: 'password', icon: '🔑', label: '密码生成器' },
  { id: 'whatPassword', icon: '🎮', label: '猜密码' },
  { id: 'song-list', icon: '🎵', label: '歌势推荐' }
]

// 折叠状态 - 默认收起
const isCollapsed = ref(true)

// 切换折叠状态
const toggleDock = () => {
  isCollapsed.value = !isCollapsed.value
}

// 组件挂载和卸载时添加/移除事件监听
onMounted(() => {
  // 3秒后自动收起
  setTimeout(() => {
    isCollapsed.value = true
  }, 3000)
})

const handleClick = (tab: string) => {
  emit('tab-change', tab)
  // 点击功能后自动收起
  isCollapsed.value = true
}
</script>

<style scoped>
.dock-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

/* 通用折叠按钮 */
.toggle-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1001;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.toggle-button:hover {
  transform: scale(1.1);
}

.dock {
  display: flex;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  transition: all 0.3s ease;
  transform-origin: bottom right;
}

/* 折叠状态 */
.dock.collapsed {
  transform: scale(0);
  opacity: 0;
  pointer-events: none;
  height: 0;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 6px; /* 进一步步增加左右外边距 */
  padding: 8px 10px; /* 增加内边距 */
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
  .dock {
    flex-direction: column;
  }

  .dock-item {
    padding: 12px 10px;
    margin: 5px 0;
  }
  
  .toggle-icon {
    font-size: 20px;
  }
}
</style>