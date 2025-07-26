<script setup lang="ts">
</script>

<template>
  <div class="card song-list">
    <h2>🎵 歌单</h2>

    <div class="artist-info">
      <img class="face" src="./yugege.jpg" id="face">
      <h3>鱼鸽鸽</h3>
      <p><a href="https://live.bilibili.com/673" target="_blank">直播间</a> <a href="https://space.bilibili.com/4718716" target="_blank">主页</a></p>
    </div>
  </div>
</template>

<style scoped>
.song-list {
  display: block;
}

.artist-info { 
  color: black;
  padding: 1rem;
  background-color: rgba(245, 245, 245, 0.25);
  border-radius: 8px;
  margin-top: 1rem;
}

.face {
  max-width: 150px;
  border-radius: 50%;
  margin-bottom: 1rem;
}
</style>
