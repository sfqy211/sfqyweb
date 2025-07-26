<template>
  <footer class="footer">
    <button @click="showInfo" class="version-btn">©2025秋风v1.1.2</button>
    <button @click="openGithub" class="github-btn">GitHub</button>
    <button @click="openBilibili" class="bilibili-btn">哔哩哔哩</button>
  </footer>
  <div v-if="showVersionInfo" class="version-notification">
    {{ versionInfo }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showVersionInfo = ref(false)
const versionInfo = ref('')

const openGithub = () => {
  window.open('https://github.com/sfqy211')
}
const openBilibili = () => {
  window.open('https://space.bilibili.com/182587768')
}

const showInfo = () => {
  versionInfo.value = '开发团队：朔风秋叶\n版本更新历史：\nv1.0.0 - 初始版本\nv1.0.1 - 新增了计算器功能，删除待办功能，优化移动端页面\nv1.0.2 - 修复了计算器显示错误，新增了密码生成器\nv1.0.3 - 新增了猜密码小游戏\nv1.0.4 - 修复了猜密码小游戏的界面显示问题，准备开始项目结构优化\nv1.1.0 - 优化代码结构，便于后续开发\nv1.1.1 - 增加鱼鸽鸽歌单\nv1.1.2 - 简化歌单'
  showVersionInfo.value = true
  setTimeout(() => {
    showVersionInfo.value = false
  }, 3000)
}
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 1rem;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  z-index: 999;
}

.version-btn, .github-btn, .bilibili-btn {
  padding: 0.25rem 0.5rem;
  background: #ffffff6a;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.version-btn:hover, .github-btn:hover, .bilibili-btn:hover {
  background: #2d3338;
}

.version-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.7);
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
  white-space: pre-wrap;
  color: black;
}
</style> 