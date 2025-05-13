<template>
  <div class="blog-container">
    <h1 class="blog-title">博客列表</h1>
    
    <div v-if="loading" class="loading">
      <p>加载中...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="posts.length === 0" class="empty-state">
      <p>暂无博客文章</p>
      <p class="hint">请在 /public/blog 目录中添加 Markdown 文件</p>
    </div>
    
    <div v-else class="blog-list">
      <div 
        v-for="post in posts" 
        :key="post.filename"
        class="blog-card"
        @click="selectPost(post)"
      >
        <h2 class="post-title">{{ post.title }}</h2>
        <p class="post-date">{{ formatDate(post.date) }}</p>
        <p class="post-excerpt">{{ post.excerpt }}</p>
      </div>
    </div>
    
    <div v-if="selectedPost" class="blog-detail">
      <div class="blog-detail-header">
        <button class="back-button" @click="selectedPost = null">返回列表</button>
        <h1>{{ selectedPost.title }}</h1>
        <p class="post-date">{{ formatDate(selectedPost.date) }}</p>
      </div>
      <div class="blog-content" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'

interface BlogPost {
  filename: string
  title: string
  date: Date
  content: string
  excerpt: string
}

const posts = ref<BlogPost[]>([])
const loading = ref(true)
const error = ref('')
const selectedPost = ref<BlogPost | null>(null)

const renderedContent = computed(() => {
  if (!selectedPost.value) return ''
  return marked(selectedPost.value.content)
})

// 格式化日期
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 从文件名中提取标题和日期
const parseFilename = (filename: string) => {
  // 假设文件名格式为: YYYY-MM-DD-title.md
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.*)\.md$/)
  
  if (match) {
    return {
      date: new Date(match[1]),
      title: match[2].replace(/-/g, ' ')
    }
  }
  
  return {
    date: new Date(),
    title: filename.replace('.md', '')
  }
}

// 从Markdown内容中提取摘要
const extractExcerpt = (content: string, maxLength = 150) => {
  // 移除Markdown标记
  const plainText = content
    .replace(/#+\s/g, '') // 移除标题
    .replace(/\[.*?\]\(.*?\)/g, '$1') // 移除链接，保留文本
    .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体
    .replace(/\*(.*?)\*/g, '$1') // 移除斜体
    .replace(/\n/g, ' ') // 将换行替换为空格
  
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + '...'
    : plainText
}

// 选择文章
const selectPost = (post: BlogPost) => {
  selectedPost.value = post
}

// 加载博客文章
const loadBlogPosts = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // 获取博客目录下的所有文件
    const response = await fetch('/blog/index.json')
    if (!response.ok) {
      throw new Error('无法获取博客列表')
    }
    
    // 从index.json获取文件列表
    const files = await response.json()
    
    const blogPosts: BlogPost[] = []
    
    // 加载每个Markdown文件
    for (const file of files) {
      if (!file.endsWith('.md')) continue
      
      const fileResponse = await fetch(`/blog/${file}`)
      if (!fileResponse.ok) continue
      
      const content = await fileResponse.text()
      const { title, date } = parseFilename(file)
      
      blogPosts.push({
        filename: file,
        title,
        date,
        content,
        excerpt: extractExcerpt(content)
      })
    }
    
    // 按日期排序，最新的在前面
    posts.value = blogPosts.sort((a, b) => b.date.getTime() - a.date.getTime())
  } catch (err) {
    console.error('加载博客文章失败:', err)
    error.value = '加载博客文章失败，请稍后再试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBlogPosts()
})
</script>

<style scoped>
.blog-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.blog-title {
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 40px 0;
  font-size: 1.2rem;
  color: #666;
}

.hint {
  font-size: 0.9rem;
  color: #999;
  margin-top: 10px;
}

.blog-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.blog-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.post-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
}

.post-date {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
}

.post-excerpt {
  color: #555;
  line-height: 1.5;
}

.blog-detail {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  overflow-y: auto;
  z-index: 1000;
}

.blog-detail-header {
  margin-bottom: 30px;
}

.back-button {
  background: #4a6fa5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 1rem;
}

.back-button:hover {
  background: #3a5a8c;
}

.blog-content {
  line-height: 1.8;
  color: #333;
}

.blog-content h1, .blog-content h2, .blog-content h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.blog-content p {
  margin-bottom: 1em;
}

.blog-content img {
  max-width: 100%;
  border-radius: 5px;
  margin: 1em 0;
}

.blog-content a {
  color: #4a6fa5;
  text-decoration: none;
}

.blog-content a:hover {
  text-decoration: underline;
}

.blog-content blockquote {
  border-left: 4px solid #4a6fa5;
  padding-left: 1em;
  margin-left: 0;
  color: #666;
}

.blog-content code {
  background: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

.blog-content pre {
  background: #f5f5f5;
  padding: 1em;
  border-radius: 5px;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .blog-list {
    grid-template-columns: 1fr;
  }
  
  .blog-detail {
    padding: 15px;
  }
}
</style>