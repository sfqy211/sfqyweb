<template>
  <div class="card calculator-card">
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
</template>

<script setup lang="ts">
import { ref } from 'vue'

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
</script>

<style scoped>
.calculator-card {
  display: block;
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

.calculator-buttons button {
  padding: 1rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  background: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.calculator-buttons button:hover {
  background: #e0e0e0;
}

.clear-btn {
  background: #ff4444;
  color: white;
}

.clear-btn:hover {
  background: #cc0000;
}

@media (max-width: 768px) {
  .calculator-display {
    font-size: 1.5rem;
  }

  .calculator-buttons button {
    padding: 0.8rem;
    font-size: 1rem;
  }
}
</style> 