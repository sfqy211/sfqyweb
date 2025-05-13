<template>
  <div class="desktop">
    <div class="desktop-background"></div>
    
    <main class="desktop-content">
      <div v-if="activeTab === 'timer'" class="app-window">
        <Timer />
      </div>
      <div v-if="activeTab === 'color'" class="app-window">
        <ColorPicker />
      </div>
      <div v-if="activeTab === 'calculator'" class="app-window">
        <Calculator />
      </div>
      <div v-if="activeTab === 'password'" class="app-window">
        <PasswordGenerator />
      </div>
      <div v-if="activeTab === 'whatPassword'" class="app-window">
        <PasswordGame />
      </div>
    </main>

    <Dock :active-tab="activeTab" @tab-change="handleTabChange" />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dock from './components/common/Dock.vue'
import Footer from './components/common/Footer.vue'
import Timer from './components/timer/Timer.vue'
import ColorPicker from './components/color/ColorPicker.vue'
import Calculator from './components/calculator/Calculator.vue'
import PasswordGenerator from './components/password/PasswordGenerator.vue'
import PasswordGame from './components/game/PasswordGame.vue'

const activeTab = ref('')

const handleTabChange = (tab: string) => {
  activeTab.value = tab
}
</script>

<style>
@import './styles/common.css';

.desktop {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

.desktop-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/background.png');
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.desktop-content {
  padding: 20px;
  min-height: calc(100vh - 120px);
}

.app-window {
  background: rgba(255, 255, 255, 0.222);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 0 auto;
  max-width: 1200px; /* Increased from 800px */
}

@media (max-width: 768px) {
  .desktop-content {
    padding: 10px;
  }
}
</style>