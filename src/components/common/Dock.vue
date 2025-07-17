<template>
  <div class="dock-container">
    <!-- 移动端折叠按钮 -->
    <div v-if="isMobile" class="mobile-toggle" @click="toggleDock">
      <span class="toggle-icon">{{ isCollapsed ? '➕' : '✖️' }}</span>
    </div>
    
    <div class="dock" :class="{ 'mobile-collapsed': isMobile && isCollapsed }">
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
  { id: 'song-list', icon: '🎵', label: '鱼鸽鸽歌单' }
]

// 移动端响应式状态
const isMobile = ref(false)
const isCollapsed = ref(true) // 默认收起

// 检测窗口大小变化
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// 组件挂载和卸载时添加/移除事件监听
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// 切换折叠状态
const toggleDock = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleClick = (tab: string) => {
  emit('tab-change', tab)
  // 在移动端点击功能后自动收起
  if (isMobile.value) {
    isCollapsed.value = true
  }
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
  .dock-container {
    bottom: 20px;
    left: auto;
    right: 20px;
    width: auto;
    height: auto;
    flex-direction: column;
  }

  .dock {
    flex-direction: column;
    padding: 10px;
    transition: all 0.3s ease;
    transform-origin: bottom right;
  }
  
  /* 折叠状态 */
  .dock.mobile-collapsed {
    transform: scale(0);
    opacity: 0;
    pointer-events: none;
  }
  
  /* 展开状态 */
  .dock:not(.mobile-collapsed) {
    transform: scale(1);
    opacity: 1;
    pointer-events: auto;
  }

  .dock-item {
    padding: 12px 10px;
    margin: 5px 0;
  }
  
  /* 移动端折叠按钮样式 */
  .mobile-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
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
  }
  
  .mobile-toggle:hover {
    transform: scale(1.1);
  }
  
  .toggle-icon {
    font-size: 20px;
  }
}
</style>