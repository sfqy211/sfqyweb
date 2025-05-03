<template>
  <Navbar :active-tab="activeTab" @tab-change="handleTabChange" />
  
  <main class="container">
    <div v-if="activeTab === 'timer'" class="card">
      <Timer />
    </div>
    <div v-if="activeTab === 'color'" class="card">
      <ColorPicker />
    </div>
    <div v-if="activeTab === 'calculator'" class="card">
      <Calculator />
    </div>
    <div v-if="activeTab === 'password'" class="card">
      <PasswordGenerator />
    </div>
    <div v-if="activeTab === 'whatPassword'" class="card">
      <PasswordGame />
    </div>
  </main>

  <Footer />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Navbar from './components/common/Navbar.vue'
import Footer from './components/common/Footer.vue'
import Timer from './components/timer/Timer.vue'
import ColorPicker from './components/color/ColorPicker.vue'
import Calculator from './components/calculator/Calculator.vue'
import PasswordGenerator from './components/password/PasswordGenerator.vue'
import PasswordGame from './components/game/PasswordGame.vue'

const activeTab = ref('timer')

const handleTabChange = (tab: string) => {
  activeTab.value = tab
}
</script>

<style>
@import './styles/common.css';
</style>