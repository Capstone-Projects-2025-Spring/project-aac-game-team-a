<template>
  <div class="join-screen">
    <h1>Join a Game</h1>

    <div class="form-group">
      <!-- Section for selecting room code using shapes -->
      <label>Select Room Code (4 shapes)</label>
      <div class="shape-slots">
        <div
          v-for="(shape, index) in selectedShapes"
          :key="index"
          class="shape-slot"
        >
          <!-- Display selected shape images -->
          <img v-if="shape" :src="shape" />
        </div>
      </div>
      <div class="shape-container">
        <!-- Display shape selection buttons -->
        <button
          v-for="(shape, index) in shapes"
          :key="index"
          @click="selectShape(shape)"
          class="shape-button"
        >
          <img :src="shape.imgSrc" :alt="shape.label" />
          <p>{{ shape.label }}</p>
        </button>
      </div>
      <div class="button-row">
        <!-- Buttons to undo and clear shape selections -->
        <button class="undo-btn" @click="undoShape">Undo Last</button>
        <button class="clear-btn" @click="clearShapes">Clear All</button>
      </div>
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

    <!-- Button to join the lobby with the selected configurations -->
    <RouterLink 
    :to="{
        path: '/game', // Navigates to the game route
        query: { user: currentUser, avatar: currentUserAvatar, roomCode: roomCodeArr} // Passes selected user data as query params
    }"
    class="join-btn" 
    @click="joinLobby">
      Join Lobby</RouterLink>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Reactive state for storing selected shapes
const selectedShapes = ref([null, null, null, null])

// List of available shapes
const shapes = [
  { value: 1, imgSrc: 'circle.png', label: 'Circle' },
  { value: 2, imgSrc: 'diamond.png', label: 'Diamond' },
  { value: 3, imgSrc: 'heart.png', label: 'Heart' },
  { value: 4, imgSrc: 'octagon.png', label: 'Octagon' },
  { value: 5, imgSrc: 'pentagon.png', label: 'Pentagon' },
  { value: 6, imgSrc: 'rectangle.png', label: 'Rectangle' },
  { value: 7, imgSrc: 'square.png', label: 'Square' },
  { value: 8, imgSrc: 'star.png', label: 'Star' },
  { value: 9, imgSrc: 'triangle.png', label: 'Triangle' }
]

// Function to select a shape and add it to the room code
function selectShape(shape) {
  const index = selectedShapes.value.findIndex((s) => s === null)
  if (index !== -1) {
    selectedShapes.value[index] = shape.imgSrc
  }
  roomCodeArr.value = selectedShapes.value
    .map((shapeImg) => shapes.find((s) => s.imgSrc === shapeImg)?.value || '')
}

// Function to undo the last selected shape
function undoShape() {
  const lastIndex = [...selectedShapes.value].reverse().findIndex((s) => s !== null)
  if (lastIndex !== -1) {
    selectedShapes.value[selectedShapes.value.length - 1 - lastIndex] = null
  }
}

// Function to clear all selected shapes
function clearShapes() {
  selectedShapes.value = [null, null, null, null]
}

// Reactive state for user information
const currentUser = ref('')
const currentUserAvatar = ref('')
const roomCodeArr = ref('')

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

// Function to validate selection and join the lobby
function joinLobby() {
  if (selectedShapes.value.includes(null) || !currentUserAvatar.value) {
    alert('Please select all 4 shapes and an avatar.')
    return
  }
  alert(`Joining room ${roomCodeArr.value.join('')} as ${currentUser.value}`)
}
</script>

<style scoped>
.join-screen {
  max-width: 500px;
  margin: 80px auto;
  padding: 40px;
  background-color: #fff;
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
  margin-bottom: 30px;
  text-align: left;
}

.shape-slots {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
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

.shape-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-top: 10px;
  justify-items: center;
}

.shape-button {
  border: 2px solid transparent;
  border-radius: 10px;
  padding: 6px;
  cursor: pointer;
  text-align: center;
  width: 80px;
  transition: transform 0.2s, border-color 0.2s;
}

.shape-button img {
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
}

.shape-button p {
  margin: 0;
  font-size: 0.8rem;
}

.shape-button:hover {
  transform: scale(1.05);
  border-color: #007bff;
}

.button-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.undo-btn,
.clear-btn {
  padding: 8px 14px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.undo-btn {
  background-color: #ffca2c;
}

.undo-btn:hover {
  background-color: #e0a800;
}

.clear-btn {
  background-color: #dc3545;
  color: white;
}

.clear-btn:hover {
  background-color: #a71d2a;
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

.join-btn {
  margin-top: 25px;
  padding: 12px 20px;
  font-size: 1.1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 12px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

.join-btn:hover {
  background-color: #1c7c31;
  transform: translateY(-2px);
}
</style>
