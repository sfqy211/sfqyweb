<template>
  <div class="card song-list">
    <h2>🎵 Song List</h2>
    <div class="search_box">
      <div class="search_form">
        <input class="search_input" type="text" placeholder="点'搜索'进行随机或输入文字搜索">
        <button class="search_button">搜索</button>
      </div>
    </div>
    <div class="type_box">
      <ul class="type_list">
        <span class="type_selected">全部</span>
        <span class="type">流行</span>
        <span class="type">古风</span>
      </ul>
    </div>
    <div class="artist-info" type="artist">
      <h3>鱼鸽鸽</h3>
      <p>这是一个机智帅气 美丽动人 玉树临风 风流倜傥的冰山美人 集英俊帅气于一身站在食物链顶端的天才电竞美少女！</p>
      <p><a href="https://live.bilibili.com/673" target="_blank">直播间</a></p>
      <p>网易云：鱼鸽鸽</p>
    </div>
    <div class="song_list">
    </div>
  </div>
</template>

<style scoped>
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
}

.info_tag_area {
  display: flex;
  gap: 0.5rem;
}

.info_tag {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.artist-info { 
  color: black;
}
</style>