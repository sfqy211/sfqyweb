<template>
  <nav class="navbar">
    <div class="logo">秋风的百宝箱</div>
    <div class="nav-items">
      <button @click="toggleMenu" class="menu-btn" v-if="isMobile">☰</button>
      <div v-if="!isMobile || showMenu" :class="{ show: showMenu }">
        <button @click="activeTab = 'timer'" :class="{ active: activeTab === 'timer' }">倒计时</button>
        <button @click="activeTab = 'color'" :class="{ active: activeTab === 'color' }">颜色查询</button>
        <button @click="activeTab = 'calculator'" :class="{ active: activeTab === 'calculator' }">计算器</button>
        <button @click="activeTab = 'password'" :class="{ active: activeTab === 'password' }">密码生成器</button>
        <button @click="activeTab = 'whatPassword'" :class="{ active: activeTab === 'whatPassword' }">猜密码小游戏</button>
      </div>
    </div>
  </nav>

  <main class="container">
    <div class="card timer-card" v-show="activeTab === 'timer'">
      <h2>⏳ 任务倒计时</h2>
      <div class="timer-controls">
        <input
          type="number"
          v-model="minutes"
          min="1"
          placeholder="分钟"
          class="time-input"
        />
        <button @click="startTimer" :disabled="isRunning" class="timer-btn">
          {{ isRunning ? '计时中...' : '开始' }}
        </button>
        <button @click="resetTimer" class="reset-btn">重置</button>
      </div>
      <div class="time-display">
        {{ formattedTime }}
      </div>
    </div>
    <div class="card color-card" v-show="activeTab === 'color'">
      <h2>🎨 颜色查询</h2>
      <div class="color-picker-container">
        <input type="color" v-model="selectedColor" class="color-picker" />
      </div>
      <div class="color-code-display">
        <div class="code-item">
          <label>HEX:</label>
          <span>{{ selectedColor }}</span>
        </div>
        <div class="code-item">
          <label>RGB:</label>
          <span>{{ rgbColor }}</span>
        </div>
        <div class="code-item">
          <label>HSL:</label>
          <span>{{ hslColor }}</span>
        </div>
      </div>
    </div>
    <div class="card calculator-card" v-show="activeTab === 'calculator'">
      <h2>🧮 计算器</h2>
      <div class="calculator-display">{{ currentValue }}</div>
      <div class="calculator-buttons">
        <button @click="inputNumber('7')">7</button>
        <button @click="inputNumber('8')">8</button>
        <button @click="inputNumber('9')">9</button>
        <button @click="inputOperator('/')">/</button>
        <button @click="inputNumber('4')">4</button>
        <button @click="inputNumber('5')">5</button>
        <button @click="inputNumber('6')">6</button>
        <button @click="inputOperator('*')">*</button>
        <button @click="inputNumber('1')">1</button>
        <button @click="inputNumber('2')">2</button>
        <button @click="inputNumber('3')">3</button>
        <button @click="inputOperator('-')">-</button>
        <button @click="inputNumber('0')">0</button>
        <button @click="inputDecimal()">.</button>
        <button @click="calculate()">=</button>
        <button @click="inputOperator('+')">+</button>
        <button @click="clear()" class="clear-btn">C</button>
      </div>
    </div>
    <div class="card password-card" v-show="activeTab === 'password'">
      <h2>🔒 密码生成器</h2>
      <div class="password-controls">
        <input type="number" v-model="passwordLength" min="1" placeholder="密码长度" class="password-length-input" />
        <button @click="generatePassword" class="generate-btn">生成密码</button>
    </div>
    <div class="card password-card" v-show="activeTab === 'password'">
      <h2>🎲 猜密码小游戏</h2>
      <div class="game-controls">
        <button @click="startGame" :disabled="isGameRunning">开始游戏</button>
        <button @click="resetGame" :disabled="!isGameRunning">重置游戏</button>
    </div>
  </main>
<footer @click="showInfo" class="footer">
  © 2024 秋风. 版本号 v1.0.2
</footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 添加移动端检测
const isMobile = computed(() => window.innerWidth <= 768)
const showMenu = ref(false)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}
const activeTab = ref<'timer' | 'color' | 'calculator' | 'password' | 'whatPassword'>('timer')
// 倒计时功能补充检查
const minutes = ref(5);
const seconds = ref(0);
const isRunning = ref(false);
let timer: number | null = null;

const formattedTime = computed(() => {
  const m = Math.floor(seconds.value / 60);
  const s = seconds.value % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
});

const startTimer = () => {
  if (!isRunning.value) {
    seconds.value = minutes.value * 60;
    isRunning.value = true;
    timer = setInterval(() => {
      if (seconds.value > 0) {
        seconds.value--;
      } else {
        clearInterval(timer!);
        isRunning.value = false;
        alert('时间到！');
      }
    }, 1000);
  }
};

const resetTimer = () => {
  clearInterval(timer!);
  isRunning.value = false;
  seconds.value = 0;
  minutes.value = 5;
};

const selectedColor = ref('#ffffff')
const rgbColor = computed(() => {
  const hex = selectedColor.value.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgb(${r}, ${g}, ${b})`
})
const hslColor = computed(() => {
  const hex = selectedColor.value.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    h = 0
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)
  return `hsl(${h}, ${s}%, ${l}%)`
})
const currentValue = ref('0')
const firstOperand = ref('')
const operator = ref('')
const waitingForSecondOperand = ref(false)

const inputNumber = (num: string) => {
  if (waitingForSecondOperand.value) {
    currentValue.value = currentValue.value + num
    waitingForSecondOperand.value = false
  } else {
    currentValue.value = currentValue.value === '0' ? num : currentValue.value + num
  }
}

const inputDecimal = () => {
  if (!currentValue.value.includes('.')) {
    currentValue.value += '.'
  }
}

const calculate = () => {
  const expression = currentValue.value.split(' ')
  const first = parseFloat(expression[0])
  const op = expression[1]
  const second = parseFloat(expression[2])
  
  if (isNaN(first) || isNaN(second)) return 0
  
  let result = 0
  switch (op) {
    case '+': result = first + second; break
    case '-': result = first - second; break
    case '*': result = first * second; break
    case '/': result = second !== 0 ? first / second : Infinity; break
  }
  
  currentValue.value = String(result)
  firstOperand.value = String(result)
  operator.value = ''
  waitingForSecondOperand.value = true
  return result
}

const inputOperator = (op: string) => {
  if (firstOperand.value === '') {
    firstOperand.value = currentValue.value
    operator.value = op
    currentValue.value += ` ${op} `
  } else if (operator.value) {
    const result = calculate()
    firstOperand.value = String(result)
    operator.value = op
    currentValue.value = `${result} ${op} `
  } else {
    operator.value = op
    currentValue.value += ` ${op} `
  }
  waitingForSecondOperand.value = true
}

const clear = () => {
  currentValue.value = '0'
  firstOperand.value = ''
  operator.value = ''
  waitingForSecondOperand.value = false
}
const showInfo = () => {
  alert('开发团队：朔风秋叶\n版本更新历史：\nv1.0.0 - 初始版本\nv1.0.1 - 新增了计算器功能，删除待办功能，优化移动端页面\nv1.0.2 - 修复了计算器显示及计算错误，新增了密码生成器和猜密码小游戏');
}
</script>

<style>
/* 全局样式 */
:root {
  --primary-blue: #2196F3;
  --background: #b7c2d4;
  --card-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

body {
  margin: 0;
  font-family: 'Segoe UI', system-ui;
  background: var(--background);
}

/* 导航栏样式 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.container {
  padding-top: 80px;
}
.display { 
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  align-items: center;
  padding: 1rem 2rem;
  background: rgb(165, 175, 179);
  box-shadow: var(--card-shadow);
}

.logo {
  font-weight: 700;
  color: var(--primary-blue);
  font-size: 1.5rem;
  margin-right: 3rem;
}

.nav-items button {
  padding: 0.5rem 1.5rem;
  margin: 0 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: #f5f5f5;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-items button:hover {
  background: #e0e0e0;
}

.nav-items button.active {
  background: var(--primary-blue);
  color: white;
}

.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
}

.card h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
}


.logo {
  height: 2em;
  padding: 0.5em;
  font-size: 1rem;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

/* 新增待办事项样式 */
.input-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.todo-input {
  flex: 1;
  padding: 0.8rem;
  border: 2px solid #000000;
  border-radius: 8px;
  font-size: 1rem;
  width: 50%;
}

.add-btn {
  padding: 0.8rem 1.5rem;
  background: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.add-btn:hover {
  opacity: 0.9;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.checkbox {
  margin-right: 1rem;
  width: 1.2rem;
  height: 1.2rem;
}

.completed {
  text-decoration: line-through;
  color: #666;
}

.delete-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: #ff4444;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 0.5rem;
}


/* 倒计时样式 */
.timer-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.time-input {
  width: 50px;
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.timer-btn, .reset-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.timer-btn {
  background: var(--primary-blue);
  color: white;
}

.reset-btn {
  background: #ff4444;
  color: white;
}

.time-display {
  font-size: 3rem;
  font-weight: bold;
  color: var(--primary-blue);
  text-align: center;
  margin: 2rem 0;
}

.timer-card {
  display: block;
}

.color-picker-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.color-picker {
  width: 100px;
  height: 100px;
  border: none;
  background: none;
  cursor: pointer;
}

.color-code-display {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.code-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.355);
  border-radius: 4px;
  font-size: 0.9em;
}

.code-item label {
  font-weight: bold;
  color: #666;
}
.todo-text {
  color: #333;
  cursor: pointer;
  flex-grow: 1;
}
.deadline-tag {
  background: #ffeb3b;
  border-radius: 4px;
  padding: 2px 6px;
  margin-left: 8px;
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
  }

  .logo {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .nav-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .card {
    padding: 1rem;
  }

  .todo-input,
  .time-input {
    width: 90%;
  }

  .input-group,
  .timer-controls {
    flex-direction: column;
  }

  .add-btn,
  .timer-btn,
  .reset-btn {
    width: 100%;
    margin-top: 0.5rem;
  }

  .time-display {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .logo {
    font-size: 1.2rem;
  }

  .nav-items button {
    padding: 0.5rem;
    margin: 0.25rem 0;
  }

  .todo-item {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  .time-display {
    font-size: 1.5rem;
  }
}
/* 移动端菜单样式 */
.menu-btn {
  display: none;
}

@media (max-width: 768px) {
  .menu-btn {
    display: block;
    padding: 0.5rem 1rem;
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
  }

  .nav-items > div {
    display: none;
    position: absolute;
    top: 60px;
    right: 0;
    background: white;
    box-shadow: var(--card-shadow);
    padding: 1rem;
    border-radius: 8px;
    z-index: 1000;
  }

  .nav-items > div.show {
    display: flex;
    flex-direction: column;
  }
}
.calculator-display {
  background: white;
  color: #333;
  padding: 1rem;
  border-radius: 8px;
  text-align: right;
  font-size: 2rem;
  margin-bottom: 1rem;
}
.calculator-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 1rem;
  cursor: pointer;
}
</style>