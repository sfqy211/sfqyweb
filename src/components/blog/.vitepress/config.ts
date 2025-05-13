import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '秋风的博客',
  description: '个人博客和技术分享',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/articles/' },
      { text: '关于', link: '/about' }
    ],
    sidebar: {
      '/articles/': [
        {
          text: '所有文章',
          items: [
            { text: '示例文章', link: '/articles/example' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ]
  },
  vite: {
    server: {
      port: 5174
    }
  }
})