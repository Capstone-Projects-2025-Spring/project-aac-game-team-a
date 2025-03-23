<template>
  <div class="host-screen">
    <h1>Host a New Game</h1>

    <!-- Display random room code in shapes -->
    <div class="form-group">
      <label>Room Code:</label>
      <div class="shape-code-display">
        <div v-for="(digit, index) in randomCodeDigits" :key="index" class="shape-slot">
          <img :src="getShapeImg(digit)" />
        </div>
      </div>
    </div>

    <!-- Game visibility selection -->


    <!-- Max players input -->
    <div class="form-group">
      <label>Max Players</label>
      <input type="number" v-model="maxPlayers" min="2" max="6" />
    </div>

    <!-- Number of rounds input -->
    <div class="form-group">
      <label>Number of Rounds</label>
      <input type="number" v-model="rounds" min="1" max="10" />
    </div>

    <!-- Launch room button -->
    <!-- <button class="launch-btn" @click="launchRoom">Launch Room</button> -->
    <RouterLink to="/avatar" class="launch-btn" @click="launchRoom">Launch Room</RouterLink>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Room setup state
const visibility = ref('public')
const maxPlayers = ref(4)
const rounds = ref(3)
const randomCodeDigits = ref([])

// Shape mapping
const shapes = [
  { value: 1, imgSrc: 'circle.png' },
  { value: 2, imgSrc: 'diamond.png' },
  { value: 3, imgSrc: 'heart.png' },
  { value: 4, imgSrc: 'octagon.png' },
  { value: 5, imgSrc: 'pentagon.png' },
  { value: 6, imgSrc: 'rectangle.png' },
  { value: 7, imgSrc: 'square.png' },
  { value: 8, imgSrc: 'star.png' },
  { value: 9, imgSrc: 'triangle.png' }
]

// Generate random 4-digit code on mount
onMounted(() => {
  generateRandomCode()
})

function generateRandomCode() {
  randomCodeDigits.value = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 9) + 1
  )
}

function getShapeImg(digit) {
  const found = shapes.find((s) => s.value === digit)
  return found ? found.imgSrc : ''
}

function launchRoom() {
  const codeString = randomCodeDigits.value.join('')
  alert(
    `Hosting room ${codeString} (${visibility.value}) with max ${maxPlayers.value} players and ${rounds.value} rounds`
  )
  // Add actual hosting logic here
}
</script>

<style scoped>
.host-screen {
  max-width: 500px;
  margin: 80px auto;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}

h1 {
  font-size: 2rem;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: bold;
}

.shape-code-display {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.shape-slot {
  width: 60px;
  height: 60px;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shape-slot img {
  width: 40px;
  height: 40px;
}

select,
input[type='number'] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

select:focus,
input:focus {
  border-color: #007bff;
  outline: none;
}

.launch-btn {
  margin-top: 25px;
  padding: 12px 20px;
  font-size: 1.1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.2);
  transition: background-color 0.3s, transform 0.1s;
}

.launch-btn:hover {
  background-color: #1c7c31;
  transform: translateY(-2px);
}
</style>
