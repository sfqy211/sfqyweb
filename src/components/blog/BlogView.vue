<template>
  <div class="blog-container">
    <iframe
      ref="blogFrame"
      :src="blogUrl"
      class="blog-frame"
      @load="handleIframeLoad"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const blogFrame = ref<HTMLIFrameElement | null>(null)
const blogUrl = 'http://localhost:5174'

const handleIframeLoad = () => {
  if (blogFrame.value) {
    blogFrame.value.style.height = '100%'
  }
}

onMounted(() => {
  // 在组件挂载时启动VitePress服务
  const startVitePress = async () => {
    try {
      await fetch(blogUrl)
    } catch (error) {
      console.error('VitePress服务未启动，请先运行npm run docs:dev')
    }
  }
  startVitePress()
})
</script>

<style scoped>
.blog-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #fff;
}

.blog-frame {
  width: 100%;
  height: 100%;
  border: none;
  overflow: hidden;
}
</style>