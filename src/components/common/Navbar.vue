<template>
  <nav class="navbar">
    <div class="logo">秋风的百宝箱</div>
    <div class="nav-items">
      <button @click="toggleMenu" class="menu-btn" v-if="isMobile">☰</button>
      <div v-if="!isMobile || showMenu" :class="{ show: showMenu }">
        <button @click="$emit('tab-change', 'timer')">倒计时</button>
        <button @click="$emit('tab-change', 'color')">颜色查询</button>
        <button @click="$emit('tab-change', 'calculator')">计算器</button>
        <button @click="$emit('tab-change', 'password')">密码生成器</button>
        <button @click="$emit('tab-change', 'whatPassword')">猜密码小游戏</button>
        <button @click="$emit('tab-change', 'song-list')">歌势推荐</button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const isMobile = computed(() => window.innerWidth <= 768)
const showMenu = ref(false)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.logo {
  font-weight: 700;
  color: var(--primary-blue);
  font-size: 1.5rem;
  margin-right: 3rem;
}

.nav-items button {
  padding: 0.5rem 1.5rem;
  margin: 0 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: #f5f5f5;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-items button:hover {
  background: #e0e0e0;
}

.nav-items button.active {
  background: var(--primary-blue);
  color: white;
}

.menu-btn {
  display: none;
}

@media (max-width: 768px) {
  .menu-btn {
    display: block;
    padding: 0.5rem 1rem;
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
  }

  .nav-items > div {
    display: none;
    position: absolute;
    top: 60px;
    right: 0;
    background: white;
    box-shadow: var(--card-shadow);
    padding: 1rem;
    border-radius: 8px;
    z-index: 1000;
  }

  .nav-items > div.show {
    display: flex;
    flex-direction: column;
  }
}
</style> 