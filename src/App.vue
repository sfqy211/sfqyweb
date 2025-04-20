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
      <textarea id="result" readonly class="calculator-display">{{ currentValue }}</textarea>
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
        <div>
          <input type="checkbox" v-model="useUppercase" /> 包含大写字母
          <input type="checkbox" v-model="useLowercase" /> 包含小写字母
          <input type="checkbox" v-model="useNumbers" checked /> 包含数字
          <input type="checkbox" v-model="useSymbols" /> 包含符号
          <input 
            type="number" 
            v-model="passwordLength" 
            min="4" 
            max="64" 
            placeholder="密码位数"
            class="password-length-input"
          />
          <button @click="generatePassword">生成密码</button>
        </div>
        <div class="password-display" @click="copyPassword">
          {{ password }}
        </div>
        <div v-if="showCopied" class="copied-notification">已复制到剪贴板</div>
      </div>
    </div>
    <div class="card whatPassword" v-show="activeTab === 'whatPassword'">
      <h2>🎲 猜密码小游戏</h2>
      <div class="game-controls">
        <button @click="whatRule">❓</button>
        <span class="score-display">积分: {{ score }}分</span>
        <button @click="queryAnswer" class="query-btn">质疑</button>
        <button @click="startGame" class="start-btn">开始</button>
      </div>
      <div class="chat-container">
        <div v-for="(message, index) in messages" :key="index" class="message-bubble" :class="{ 'user-message': message.sender === 'user', 'system-message': message.sender === 'system' }">
          {{ message.text }}
        </div>
      </div>
      <div class="input-area">
        <select v-model="inputType" class="input-type-select" :disabled="!gameStarted">
          <option value="result">直接猜测结果</option>
          <option value="singleNumber">是否包含某单个数字</option>
          <option value="string">是否包含某连续数字串</option>
          <option value="divisible">是否能被某数字整除</option>
          <option value="numberType">数字类型</option>
        </select>
        <input v-model="userInput" type="text" placeholder="输入你的猜测..." v-if="!showNumberTypeOptions" :disabled="!gameStarted" />
        <input v-model="userInput" type="text" placeholder="输入类型包括：奇数、偶数、质数、水仙花数、斐波那契数" v-if="showNumberTypeOptions" :disabled="!gameStarted" />
        <button @click="sendMessage" :disabled="!gameStarted">发送</button>
      </div>
    </div>
  </main>
<footer class="footer">
  <button @click="showInfo" class="version-btn">© 2024 秋风. 版本号 v1.0.4</button>
  <button @click="openGithub" class="github-btn">GitHub</button>
</footer>
<div v-if="showVersionInfo" class="version-notification">
  {{ versionInfo }}
</div>
<div v-if="showRules" class="rules-modal" @click.self="showRules = false">
  <div class="rules-content">
    <button class="close-btn" @click="showRules = false">×</button>
    <div v-html="gameRules" class="gameRules"></div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import copy from 'copy-to-clipboard'

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
const showVersionInfo = ref(false);
const versionInfo = ref('');
  
const openGithub = () => {
  window.open('https://github.com/sfqy211');
}

const showInfo = () => {
    versionInfo.value = '开发团队：朔风秋叶\n版本更新历史：\nv1.0.0 - 初始版本\nv1.0.1 - 新增了计算器功能，删除待办功能，优化移动端页面\nv1.0.2 - 修复了计算器显示错误，新增了密码生成器\nv1.0.3 - 新增了猜密码小游戏\nv1.0.4 - 修复了猜密码小游戏的部分bug和界面显示问题，准备开始项目结构优化';
    showVersionInfo.value = true;
    setTimeout(() => {
      showVersionInfo.value = false;
    }, 3000);
  }

// 密码生成器相关代码
const useUppercase = ref(true)
const useLowercase = ref(true)
const useNumbers = ref(true)
const useSymbols = ref(true)
const password = ref('')
const passwordLength = ref(12)
const showCopied = ref(false)

const generatePassword = () => {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numberChars = '0123456789'
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:\'",./<>?'
  
  let requiredChars = []
  let allChars = ''
  
  if (useUppercase.value) {
    requiredChars.push(uppercaseChars)
    allChars += uppercaseChars
  }
  if (useLowercase.value) {
    requiredChars.push(lowercaseChars)
    allChars += lowercaseChars
  }
  if (useNumbers.value) {
    requiredChars.push(numberChars)
    allChars += numberChars
  }
  if (useSymbols.value) {
    requiredChars.push(symbolChars)
    allChars += symbolChars
  }
  
  let generatedPassword = ''
  
  // 确保每种选中的字符类型至少包含一个字符
  requiredChars.forEach(chars => {
    generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length))
  })
  
  // 随机填充剩余位数
  for (let i = requiredChars.length; i < passwordLength.value; i++) {
    generatedPassword += allChars.charAt(Math.floor(Math.random() * allChars.length))
  }
  
  // 打乱密码顺序
  password.value = generatedPassword.split('').sort(() => 0.5 - Math.random()).join('')
}

const copyPassword = () => {
  copy(password.value)
  showCopied.value = true;
  setTimeout(() => {
    showCopied.value = false;
  }, 1000);
}

// 猜密码小游戏相关代码
const gamePassword = ref('')
const gameStarted = ref(false)
const score = ref(0)
const messages = ref([
  { sender: 'system', text: '欢迎来到猜密码小游戏！请点击开始按钮生成密码' }
])
const hasLied = ref(false)

const showRules = ref(false);
const gameRules = ref(`
  <h3>猜密码小游戏规则</h3>
  <ol>
    <li>游戏开始时系统会随机生成一个4位数字密码</li>
    <li>初始积分为500分</li>
    <li>你可以通过以下方式提问:
      <ul>
        <li>直接猜测结果(-50分)</li>
        <li>询问是否包含某数字(-10分)</li>
        <li>询问是否包含某连续数字串(-10分)</li>
        <li>询问是否能被某数字整除(-10分)</li>
        <li>询问数字类型(-25分)</li>
      </ul>
    </li>
    <li>系统回答可能是真话也可能是假话,说谎次数初始为1,如果质疑成功则还会说谎一次</li>
    <li>你可以点击"质疑"按钮质疑系统说谎(-100分),质疑成功+900分</li>
    <li>积分用完游戏结束</li>
  </ol>
`);

const whatRule = () => {
  showRules.value = true;
}

const queryAnswer = () => {
  if (!hasLied.value) {
    score.value -= 100;
    messages.value.push({ sender: 'system', text: '质疑失败，当前没有说谎的回答' });
  } else {
    score.value += 900;
    hasLied.value = false;
    messages.value.push({ sender: 'system', text: '恭喜您质疑成功，当前存在说谎的回答' });
  }
}

const startGame = () => {
  // 生成4位数字密码
  gamePassword.value = ''
  for (let i = 0; i < 4; i++) {
    gamePassword.value += Math.floor(Math.random() * 10)
  }
  gameStarted.value = true
  score.value = 500
  hasLied.value = false
  messages.value = [
    { sender: 'system', text: '密码已生成！请开始猜测吧' },
    { sender: 'system', text: `调试信息：当前密码是 ${gamePassword.value}` }
  ]
}


const userInput = ref('')
const inputType = ref('singleNumber')
const showNumberTypeOptions = computed(() => {
  return inputType.value === 'numberType' || inputType.value === 'sumNumberType'
})

const isPrime = (num: number) => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};

const isNarcissistic = (num: number) => {
  const digits = String(num).split('');
  const len = digits.length;
  return num === digits.reduce((sum, digit) => sum + Math.pow(parseInt(digit), len), 0);
};

const isFibonacci = (num: number) => {
  return isPerfectSquare(5 * num * num + 4) || isPerfectSquare(5 * num * num - 4);
};

const isPerfectSquare = (x: number) => {
  const s = Math.sqrt(x);
  return s === Math.floor(s);
};

const sendMessage = () => {
  if (userInput.value.trim() === '') return;
  
  // 输入验证
  if (inputType.value === 'singleNumber' && (!/^\d$/.test(userInput.value) || userInput.value.length !== 1)) {
    messages.value.push({ sender: 'system', text: '您的输入不合规，请重新输入一个数字' });
    return;
  } else if (inputType.value === 'numberType' && !['奇数', '偶数', '质数', '水仙花数', '斐波那契数'].includes(userInput.value)) {
    messages.value.push({ sender: 'system', text: '您的输入不合规，请选择预设的数字属性' });
    return;
  } else if (['result', 'string', 'divisible'].includes(inputType.value) && (!/^\d+$/.test(userInput.value) || parseInt(userInput.value) > 9999)) {
    messages.value.push({ sender: 'system', text: '您的输入不合规，请输入不大于9999的数字' });
    return;
  }
  
  // 决定是否说谎(50%概率且仅限特定选项且仅一次)
  let shouldLie = false;
  if (!hasLied.value && ['singleNumber', 'string', 'divisible', 'numberType'].includes(inputType.value)) {
    shouldLie = Math.random() < 0.5;
    if (shouldLie) hasLied.value = true;
  }
  
  messages.value.push({ sender: 'user', text: userInput.value })
    nextTick(() => {
      const container = document.querySelector('.chat-container')
      if (container) container.scrollTop = container.scrollHeight
    })
    const typeMap = { '奇数':'odd', '偶数':'even', '质数':'prime', '水仙花数':'narcissistic', '斐波那契数':'fibonacci' }
const validKeys = Object.keys(typeMap) as Array<keyof typeof typeMap>;
const typeKey = validKeys.includes(userInput.value as keyof typeof typeMap) ? typeMap[userInput.value as keyof typeof typeMap] : 'odd';
    // 根据不同操作类型扣分
    if (inputType.value === 'result') {
      score.value -= 50
    } else if (inputType.value === 'numberType') {
      score.value -= 25
    } else {
      score.value -= 10
    }
    
    if (score.value <= 0) {
      messages.value.push({ sender: 'system', text: '游戏结束！积分已用完。' })
      gameStarted.value = false
      return;
    }
    
    if (inputType.value === 'result') {
      if (!/^\d{4}$/.test(userInput.value)) {
        messages.value.push({ sender: 'system', text: '请输入4位数字进行猜测！' });
        return;
      }
      if (userInput.value === gamePassword.value) {
        messages.value.push({ sender: 'system', text: '恭喜您，您猜对了！' })
      } else {
        messages.value.push({ sender: 'system', text: '很抱歉，你猜错了，请继续尝试' })
      }
    } else if (inputType.value === 'singleNumber') {
      const contains = gamePassword.value.includes(userInput.value);
      messages.value.push({ sender: 'system', text: shouldLie ? (contains ? '否 (当前此回答为假)' : '是 (当前此回答为假)') : (contains ? '是 (当前此回答为真)' : '否 (当前此回答为真)') });
    } else if (inputType.value === 'string') {
      const contains = gamePassword.value.includes(userInput.value);
      messages.value.push({ sender: 'system', text: shouldLie ? (contains ? '否 (当前此回答为假)' : '是 (当前此回答为假)') : (contains ? '是 (当前此回答为真)' : '否 (当前此回答为真)') });
    } else if (inputType.value === 'divisible') {
      const num = parseInt(userInput.value);
      const passwordNum = parseInt(gamePassword.value);
      const divisible = num !== 0 && passwordNum % num === 0;
      messages.value.push({ sender: 'system', text: shouldLie ? (divisible ? '否 (当前此回答为假)' : '是 (当前此回答为假)') : (divisible ? '是 (当前此回答为真)' : '否 (当前此回答为真)') });
    } else if (inputType.value === 'numberType') {
      const passwordNum = parseInt(gamePassword.value);
      let result = false;
      switch (typeKey) {
        case 'odd': result = passwordNum % 2 !== 0; break;
        case 'even': result = passwordNum % 2 === 0; break;
        case 'prime': 
          result = isPrime(passwordNum); 
          break;
        case 'narcissistic': 
          result = isNarcissistic(passwordNum); 
          break;
        case 'fibonacci': 
          result = isFibonacci(passwordNum); 
          break;
      }
      messages.value.push({ sender: 'system', text: shouldLie ? (result ? '否 (当前此回答为假)' : '是 (当前此回答为假)') : (result ? '是 (当前此回答为真)' : '否 (当前此回答为真)') });
    } else {
      messages.value.push({ sender: 'system', text: '这是系统回复，用户输入了：' + userInput.value })
    }
    
    userInput.value = ''
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
  background: rgba(255, 255, 255, 0.54);
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
  width: 90%;
  resize: none;
  overflow: hidden;
}
.calculator-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 1rem;
  cursor: pointer;
}

.version-btn {
  padding: 0.25rem 0.5rem;
  background: #ffffff6a;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.version-btn:hover {
  background: #2d3338;
}

.github-btn {
  padding: 0.25rem 0.5rem;
  background: #ffffff6a;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.github-btn:hover {
  background: #2d3338;
}


.rules-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.rules-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
}

.rules-content h3 {
  margin-top: 0;
  color: var(--primary-blue);
}

.rules-content ol, .rules-content ul {
  padding-left: 1.5rem;
}

.rules-content li {
  margin-bottom: 0.5rem;
}
.gameRules {
  color: black; 
}
.password-display {
  background: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
  cursor: pointer;
  color: black;
}
.copied-notification, .version-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.7);
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
  white-space: pre-wrap;
  color: black;
}
.password-controls div {
  color: black;
}
.whatPassword {
  position: relative;
  padding-bottom: 50px;
  width: 1000px;
}

.game-controls {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 15px;
}

.score-display {
  font-weight: bold;
  color: black;
  background-color: #f0f0f0;
  padding: 8px 12px;
  border-radius: 4px;
  display: inline-block;
}

.query-btn {
  background-color: black; 
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.start-btn {
  background-color: #4CAF50;
  color: black;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.chat-container {
  height: 300px;
  overflow-y: auto;
  border-bottom: 1px solid #ccc;
  margin-bottom: 1rem;
  max-height: 300px;
}
.message-bubble {
  padding: 10px;
  margin: 5px;
  border-radius: 10px;
  max-width: 70%;
  color: black;
  display: flex;
}
.user-message {
  background-color: #affd73;
  margin-left: auto;
  text-align: right;
  width: fit-content;
  max-width: 70%;
  padding: 10px 15px;
}
.system-message {
  background-color: #E0E0E0;
  margin-right: auto;
  text-align: left;
  width: fit-content;
  max-width: 70%;
  padding: 10px 15px;
}
.input-area {
  display: flex;
  position: absolute;
  bottom: 10px;
  width: calc(100% - 30px);
}
.input-area input, .input-area select {
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-right: 5px;
}
.input-area button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: var(--primary-blue);
  color: white;
  margin-left: 5px;
}

.input-type-select {
  min-width: 120px;
}

.number-type-select {
  min-width: 100px;
}
</style>