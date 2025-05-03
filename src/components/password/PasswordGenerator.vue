<template>
  <div class="card password-card">
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import copy from 'copy-to-clipboard'

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
  showCopied.value = true
  setTimeout(() => {
    showCopied.value = false
  }, 1000)
}
</script>

<style scoped>
.password-card {
  display: block;
}

.password-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.password-controls div {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.password-length-input {
  width: 100px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.password-display {
  background: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
  cursor: pointer;
  color: black;
  word-break: break-all;
}

.copied-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.7);
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
  color: black;
}

@media (max-width: 768px) {
  .password-controls div {
    flex-direction: column;
    align-items: flex-start;
  }

  .password-length-input {
    width: 100%;
  }
}
</style> 