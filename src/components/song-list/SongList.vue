<script setup lang="ts">
</script>

<template>
  <div class="card song-list">
    <h2>🎵 歌单</h2>

    <div class="artist-info">
      <div class="artist-row">
        <img class="face" src="./yugege.jpg" id="face">
        <div class="artist-text">
          <h3>鱼鸽鸽</h3>
          <p>天天开心 ✨ 正在做一场不愿醒来的梦</p>
          <p><a href="https://live.bilibili.com/673" target="_blank">直播间</a> <a href="https://space.bilibili.com/4718716" target="_blank">主页</a> <a href="https://bot.starlwr.com/songlist?uid=4718716" target="_blank">歌单</a></p>
        </div>
      </div>
    </div>
    
    <div class="artist-info">
      <div class="artist-row">
        <img class="face" src="./taoji.jpg" id="face">
        <div class="artist-text">
          <h3>桃几OvO</h3>
          <p>八木百货所属小猫音乐播放器 / 合作请私信 / 原画@透明尾巴 / 建模@天雨RainFall / 调音@由助</p>
          <p><a href="https://live.bilibili.com/22642754" target="_blank">直播间</a> <a href="https://space.bilibili.com/1104048496" target="_blank">主页</a> <a href="https://www.ovo.fan" target="_blank">歌单</a></p>
        </div>
      </div>
    </div>
    
    <div class="artist-info">
      <div class="artist-row">
        <img class="face" src="./dage.jpg" id="face">
        <div class="artist-text">
          <h3>大哥L-</h3>
          <p>-</p>
          <p><a href="https://live.bilibili.com/443197" target="_blank">直播间</a> <a href="https://space.bilibili.com/17967817" target="_blank">主页</a> <a href="https://dagel.live" target="_blank">歌单</a></p>
        </div>
      </div>
    </div>
    
    <div class="artist-info">
      <div class="artist-row">
        <img class="face" src="./nilian.jpg" id="face">
        <div class="artist-text">
          <h3>妮莉安Lily</h3>
          <p>月蚀Lunaclipse企划所属 原创音乐人/虚拟Vup 来自星灵学院的歌者妮莉安lily。</p>
          <p><a href="https://live.bilibili.com/27484357" target="_blank">直播间</a> <a href="https://space.bilibili.com/3493271057730096" target="_blank">主页</a> <a href="https://www.nilianlily.cn" target="_blank">歌单</a></p>
        </div>
      </div>
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

.artist-row {
  display: flex;
  align-items: center;
}

.artist-text {
  margin-left: 1.5rem;
}

.face {
  max-width: 100px;
  border-radius: 50%;
}
</style>
