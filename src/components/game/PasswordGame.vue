<template>
  <div class="card whatPassword">
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
  <div v-if="showRules" class="rules-modal" @click.self="showRules = false">
    <div class="rules-content">
      <button class="close-btn" @click="showRules = false">×</button>
      <div v-html="gameRules" class="gameRules"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const gamePassword = ref('')
const gameStarted = ref(false)
const score = ref(0)
const messages = ref([
  { sender: 'system', text: '欢迎来到猜密码小游戏！请点击开始按钮生成密码' }
])
const hasLied = ref(false)
const showRules = ref(false)
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
        <li>询问数字类型：奇数、偶数、质数、水仙花数、斐波那契数(-25分)</li>
      </ul>
    </li>
    <li>系统回答可能是真话也可能是假话,说谎次数初始为1,如果质疑成功则还会说谎一次</li>
    <li>你可以点击"质疑"按钮质疑系统说谎(-100分),质疑成功+900分</li>
    <li>积分用完游戏结束</li>
  </ol>
`)

const whatRule = () => {
  showRules.value = true
}

const queryAnswer = () => {
  if (!hasLied.value) {
    score.value -= 100
    messages.value.push({ sender: 'system', text: '质疑失败，当前没有说谎的回答' })
  } else {
    score.value += 900
    hasLied.value = false
    messages.value.push({ sender: 'system', text: '恭喜您质疑成功，当前存在说谎的回答' })
  }
}

const startGame = () => {
  gamePassword.value = ''
  for (let i = 0; i < 4; i++) {
    gamePassword.value += Math.floor(Math.random() * 10)
  }
  gameStarted.value = true
  score.value = 500
  hasLied.value = false
  messages.value = [
    { sender: 'system', text: '密码已生成！请开始猜测吧' }
  ]
}

const userInput = ref('')
const inputType = ref('singleNumber')
const showNumberTypeOptions = computed(() => {
  return inputType.value === 'numberType' || inputType.value === 'sumNumberType'
})

const isPrime = (num: number) => {
  if (num <= 1) return false
  if (num <= 3) return true
  if (num % 2 === 0 || num % 3 === 0) return false
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false
  }
  return true
}

const isNarcissistic = (num: number) => {
  const digits = String(num).split('')
  const len = digits.length
  return num === digits.reduce((sum, digit) => sum + Math.pow(parseInt(digit), len), 0)
}

const isFibonacci = (num: number) => {
  return isPerfectSquare(5 * num * num + 4) || isPerfectSquare(5 * num * num - 4)
}

const isPerfectSquare = (x: number) => {
  const s = Math.sqrt(x)
  return s === Math.floor(s)
}

const sendMessage = () => {
  if (userInput.value.trim() === '') return
  
  // 输入验证
  if (inputType.value === 'singleNumber' && (!/^\d$/.test(userInput.value) || userInput.value.length !== 1)) {
    messages.value.push({ sender: 'system', text: '您的输入不合规，请重新输入一个数字' })
    return
  } else if (inputType.value === 'numberType' && !['奇数', '偶数', '质数', '水仙花数', '斐波那契数'].includes(userInput.value)) {
    messages.value.push({ sender: 'system', text: '您的输入不合规，请选择预设的数字属性' })
    return
  } else if (['result', 'string', 'divisible'].includes(inputType.value) && (!/^\d+$/.test(userInput.value) || parseInt(userInput.value) > 9999)) {
    messages.value.push({ sender: 'system', text: '您的输入不合规，请输入不大于9999的数字' })
    return
  }
  
  // 决定是否说谎(50%概率且仅限特定选项且仅一次)
  let shouldLie = false
  if (!hasLied.value && ['singleNumber', 'string', 'divisible', 'numberType'].includes(inputType.value)) {
    shouldLie = Math.random() < 0.5
    if (shouldLie) hasLied.value = true
  }
  
  messages.value.push({ sender: 'user', text: userInput.value })
  nextTick(() => {
    const container = document.querySelector('.chat-container')
    if (container) container.scrollTop = container.scrollHeight
  })
  
  const typeMap = { '奇数':'odd', '偶数':'even', '质数':'prime', '水仙花数':'narcissistic', '斐波那契数':'fibonacci' }
  const validKeys = Object.keys(typeMap) as Array<keyof typeof typeMap>
  const typeKey = validKeys.includes(userInput.value as keyof typeof typeMap) ? typeMap[userInput.value as keyof typeof typeMap] : 'odd'
  
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
    return
  }
  
  if (inputType.value === 'result') {
    if (!/^\d{4}$/.test(userInput.value)) {
      messages.value.push({ sender: 'system', text: '请输入4位数字进行猜测！' })
      return
    }
    if (userInput.value === gamePassword.value) {
      messages.value.push({ sender: 'system', text: '恭喜您，您猜对了！' })
    } else {
      messages.value.push({ sender: 'system', text: '很抱歉，你猜错了，请继续尝试' })
    }
  } else if (inputType.value === 'singleNumber') {
    const contains = gamePassword.value.includes(userInput.value)
    messages.value.push({ sender: 'system', text: shouldLie ? (contains ? '否' : '是') : (contains ? '是' : '否') })
  } else if (inputType.value === 'string') {
    const contains = gamePassword.value.includes(userInput.value)
    messages.value.push({ sender: 'system', text: shouldLie ? (contains ? '否' : '是') : (contains ? '是' : '否') })
  } else if (inputType.value === 'divisible') {
    const num = parseInt(userInput.value)
    const passwordNum = parseInt(gamePassword.value)
    const divisible = num !== 0 && passwordNum % num === 0
    messages.value.push({ sender: 'system', text: shouldLie ? (divisible ? '否' : '是') : (divisible ? '是' : '否') })
  } else if (inputType.value === 'numberType') {
    const passwordNum = parseInt(gamePassword.value)
    let result = false
    switch (typeKey) {
      case 'odd': result = passwordNum % 2 !== 0; break
      case 'even': result = passwordNum % 2 === 0; break
      case 'prime': result = isPrime(passwordNum); break
      case 'narcissistic': result = isNarcissistic(passwordNum); break
      case 'fibonacci': result = isFibonacci(passwordNum); break
    }
    messages.value.push({ sender: 'system', text: shouldLie ? (result ? '否' : '是') : (result ? '是' : '否') })
  }
  
  userInput.value = ''
}
</script>

<style scoped>
.whatPassword {
  position: relative;
  padding-bottom: 50px;
  width: 100%;
}

@media (min-width: 768px) {
  .whatPassword {
    width: 1000px;
  }
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
  color: white;
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
  width: calc(100% - 40px);
}

.input-area input, .input-area select {
  flex: 0.5;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-right: 5px;
}

.input-area button {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  background-color: var(--primary-blue);
  color: white;
  margin-left: 5px;
}

.input-type-select {
  min-width: 100px;
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
</style> 