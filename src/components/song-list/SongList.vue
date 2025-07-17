<script setup lang="ts">
    import songs from './songs.json'
    import { ref } from 'vue'
    
    interface Song {
      name: string;
      artist: string;
      tags: string[];
      note: string;
    }

const showToast = ref(false)
const toastMessage = ref('')

const randomSong = () => {
  const randomIndex = Math.floor(Math.random() * songs.length)
  const song = songs[randomIndex]
  const text = `点歌 ${song.name}`
  navigator.clipboard.writeText(text).then(() => {
    toastMessage.value = `已复制: ${text}`
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000) // 2秒后自动消失
  }).catch(err => {
    console.error('复制失败:', err)
  })
}
</script>

<template>
  <div class="card song-list">
    <h2>🎵 歌单</h2>

    <div class="right-panel">
        <div class="artist-info">
          <img class="face" src="./yugege.jpg" id="face">
          <h3>歌手：鱼鸽鸽</h3>
          <p>这是一个机智帅气 美丽动人 玉树临风 风流倜傥的冰山美人 集英俊帅气于一身站在食物链顶端的天才电竞美少女！是一只河豚</p>
          <p>直播间：<a href="https://live.bilibili.com/673" target="_blank">https://live.bilibili.com/673</a></p>
          <p>网易云：鱼鸽鸽</p>
        </div>
        
        <div class="type_box">
          <div class="title">标签</div>
          <ul class="type_list">
            <span class="type_selected">全部</span>
            <span class="type">流行</span>
            <span class="type">古风</span>
            <span class="type">中文</span>
            <span class="type">英文</span>
          </ul>
        </div>
        
        <div class="search_box">
          <div class="search_form">
            <input class="search_input" type="text" placeholder="输入文字搜索">
            <button class="search_button">搜索</button>
            <button class="random_button" @click="randomSong">随机一首</button>
          </div>
        </div>
    </div>

    <div class="left-panel">
      <div class="song-list-container">
        <div class="song_list">
          <div class="song_item" v-for="(song, index) in songs" :key="index">
            <div class="song_info">{{ song.name }} - {{ song.artist }}</div>
            <div class="info_tag_area">
              <span class="info_tag" v-for="(tag, tagIndex) in song.tags" :key="tagIndex">{{ tag }}</span>
            </div>
              <div class="song_note">{{ song.note }}</div>
            </div>
          </div>
        </div>
    </div>

  </div>
  <div v-if="showToast" class="toast">
      {{ toastMessage }}
  </div>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  animation: fadeInOut 2s;
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
}

.song_note {
  font-size: 0.9rem;
  color: #000000;
  margin-top: 0.5rem;
}

.song-list-container {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
}

.left-panel {
  min-width: 0;
}

.right-panel {
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.song-list {
  display: block;
}

.search_box {
  margin: 1rem 0;
}

.search_form {
  display: flex;
  gap: 0.5rem;
}

.search_input {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.search_button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #2196F3;
  color: white;
  cursor: pointer;
}

.random_button { 
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #2196F3;
  color: white;
  cursor: pointer;
}

.type_box {
  margin: 1rem 0;
}

.title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.type_list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
}

.type, .type_selected {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
}

.type {
  background-color: rgba(33, 150, 243, 0.2);
  color: #333;
}

.type_selected {
  background-color: #2196F3;
  color: white;
}

.song_list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.song_item {
  background-color: rgba(245, 245, 245, 0.25);
  border-radius: 8px;
  padding: 1rem;
  transition: background-color 0.2s;
}

.song_item:hover {
  background-color: rgba(245, 245, 245, 0.5);
}

.song_info {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: black;
}

.info_tag_area {
  display: flex;
  gap: 0.5rem;
}

.info_tag {
  color: #000000;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.artist-info { 
  color: black;
}

.title {
  color: black;
}
</style>
