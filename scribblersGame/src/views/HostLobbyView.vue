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

    <div class="form-group">
      <!-- Section for choosing an avatar -->
      <label>Choose Your Avatar</label>
      <div class="avatar-container">
        <button
          v-for="(button, index) in avatarButtons"
          :key="index"
          @click="selectAvatar(button)"
          :class="['avatar-button', { selected: currentUserAvatar === button.imgSrc }]"
        >
          <img :src="button.imgSrc" :alt="button.label" />
          <p>{{ button.label }}</p>
        </button>
      </div>
    </div>

    <div class="bottom-buttons">
      <RouterLink 
      :to="{
          path: '/game', // Navigates to the game route
      }"
      class="launch-btn" 
      @click="launchRoom">Launch Room</RouterLink>
      
      <RouterLink 
      :to="{
          path: '/', // Navigates to the home route
      }"
      class="back-btn">Back</RouterLink>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { GameState } from '@/stores/GameState'

// Define local state to send user data to Game
const localGameState = GameState();

// Room setup state
const visibility = ref('public')
const maxPlayers = ref(4)
const rounds = ref(3)
const randomCodeDigits = ref([])
const currentUser = ref('')
const currentUserAvatar = ref('')

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

// List of available avatars
const avatarButtons = [
  { id: 1, imgSrc: 'lion.png', label: 'Lion' },
  { id: 2, imgSrc: 'tiger.webp', label: 'Tiger' },
  { id: 3, imgSrc: 'bear.png', label: 'Bear' },
  { id: 4, imgSrc: 'monkey.png', label: 'Monkey' },
  { id: 5, imgSrc: 'gorilla.png', label: 'Gorilla' },
  { id: 6, imgSrc: 'eagle.png', label: 'Eagle' },
  { id: 7, imgSrc: 'cat.png', label: 'Cat' },
  { id: 8, imgSrc: 'dog.png', label: 'Dog' }
]

// Function to select an avatar
function selectAvatar(button) {
  currentUser.value = button.label
  currentUserAvatar.value = button.imgSrc
}

function launchRoom() {
  const codeString = randomCodeDigits.value.join('')
  alert(
    `Hosting room ${codeString} (${visibility.value}) with max ${maxPlayers.value} players and ${rounds.value} rounds`
  )
  // Add actual hosting logic here

   // Use local state to set and save the selection of the user
   localGameState.setUser(currentUser, currentUserAvatar, randomCodeDigits)

}
</script>

<style scoped>
.host-screen {
  max-width: 500px;
  margin: 80px auto;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 20px;
  border-style: solid;
  border-color: black;
  border-width: 3px;
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

.avatar-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  justify-items: center;
  margin-top: 10px;
}

.avatar-button {
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  text-align: center;
  width: 100px;
  transition: border-color 0.3s, transform 0.2s;
}

.avatar-button img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-bottom: 5px;
}

.avatar-button p {
  margin: 0;
  font-size: 0.9rem;
}

.avatar-button:hover {
  transform: scale(1.05);
}

.avatar-button.selected {
  border-color: #007bff;
  background-color: #f0f8ff;
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

.bottom-buttons{
  display: flex;
  flex-direction: column;
}

.launch-btn {
  margin-top: 25px;
  padding: 12px 20px;
  font-size: 1.1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 12px;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.2);
  transition: background-color 0.3s, transform 0.1s;
}

.launch-btn:hover {
  background-color: #1c7c31;
  transform: translateY(-2px);
}

.back-btn{
  margin-top: 25px;
  padding: 12px 20px;
  font-size: 1.1rem;
  background-color: #d01912;
  color: white;
  border: none;
  border-radius: 12px;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.2);
  transition: background-color 0.3s, transform 0.1s;
}

.back-btn:hover {
  background-color: #881915;
  transform: translateY(-2px);
}
</style>
