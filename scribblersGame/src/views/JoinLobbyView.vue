<template>
  <!-- Opens the settings overlay -->
  <button @click="settingsState.toggleSettings()" class="settings-button" :class="{ 'blurred': settingsState.showSettings }"> 
    <img @click="speakNow('Settings')" src="/settingsIcon.png" class="settings-img">
  </button>

  <div class="join-screen" :class="{ 'blurred': settingsState.showSettings }">
    <h1 @click="speakNow('Join a Game')">Join a Game</h1>

    <div class="form-group">
      <!-- Section for selecting room code using shapes -->
      <label @click="speakNow('Select Room Code (4 shapes)')">Select Room Code (4 shapes)</label>
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
      <label @click="speakNow('Choose Your Avuht-ar')">Choose Your Avatar</label>
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
      <!-- Button to join the waiting room instead of going directly to game -->
      <RouterLink 
      :to="{
          path: '/game', // Navigates to the game route
      }"
      class="join-btn" 
      @click="joinLobby">
        Join Lobby</RouterLink>

      <RouterLink 
      @click="speakNow('Back')"
      :to="{
          path: '/', // Navigates to the home route
      }"
      class="back-btn">Back</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { GameState } from '@/stores/GameState'
import { SettingState } from '@/stores/SettingState'

// Define state to send user data to Game
const userGameState = GameState();
// Define state of the settings
const settingsState = SettingState();

// Called to turn text into speech
function speakNow(textToSpeak) {
  // Cancel any current TTS
  speechSynthesis.cancel();
  // Only use text-to-speech if enabled and the string does not contain 'null'
  if(settingsState.enableTTS && !textToSpeak.includes('null')){
    const utterance = new SpeechSynthesisUtterance(textToSpeak); // Synthesize the speech
    utterance.volume = settingsState.volumeTTS // Set the volume of speech
    utterance.lang = 'en'; // Specify the language
    speechSynthesis.speak(utterance); // Speak fido
  }
}

// Reactive state for storing selected shapes
const selectedShapes = ref([null, null, null, null])

// List of available shapes
const shapes = [
  { value: 1, imgSrc: '/circle.png', label: 'Circle' },
  { value: 2, imgSrc: '/diamond.png', label: 'Diamond' },
  { value: 3, imgSrc: '/heart.png', label: 'Heart' },
  { value: 4, imgSrc: '/octagon.png', label: 'Octagon' },
  { value: 5, imgSrc: '/pentagon.png', label: 'Pentagon' },
  { value: 6, imgSrc: '/rectangle.png', label: 'Rectangle' },
  { value: 7, imgSrc: '/square.png', label: 'Square' },
  { value: 8, imgSrc: '/star.png', label: 'Star' },
  { value: 9, imgSrc: '/triangle.png', label: 'Triangle' }
]

// Reactive state for room code array
const roomCodeArr = ref([])

// Function to select a shape and add it to the room code
function selectShape(shape) {
  // Speak the shape being selected
  speakNow(shape.label);

  const index = selectedShapes.value.findIndex((s) => s === null)
  if (index !== -1) {
    selectedShapes.value[index] = shape.imgSrc
    
    // Update room code array
    roomCodeArr.value = selectedShapes.value
      .map((shapeImg) => {
        const found = shapes.find((s) => s.imgSrc === shapeImg)
        return found ? found.value : ''
      })
      .filter(val => val !== '')
  }
}

// Function to undo the last selected shape
function undoShape() {
  speakNow('Undo'); // TTS

  const lastIndex = [...selectedShapes.value].reverse().findIndex((s) => s !== null)
  if (lastIndex !== -1) {
    selectedShapes.value[selectedShapes.value.length - 1 - lastIndex] = null
    
    // Update room code array
    roomCodeArr.value = selectedShapes.value
      .map((shapeImg) => {
        const found = shapes.find((s) => s.imgSrc === shapeImg)
        return found ? found.value : ''
      })
      .filter(val => val !== '')
  }
}

// Function to clear all selected shapes
function clearShapes() {
  speakNow('Clear'); // TTS
  selectedShapes.value = [null, null, null, null]
  roomCodeArr.value = []
}

// Reactive state for user information
const currentUser = ref('')
const currentUserAvatar = ref('')

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
  speakNow(button.label);
  currentUser.value = button.label
  currentUserAvatar.value = button.imgSrc
}

// Function to validate selection and join the lobby
function joinLobby() {
  speakNow('Joining lobby')
  if (selectedShapes.value.includes(null) || !currentUserAvatar.value) {
    alert('Please select all 4 shapes and an avatar.')
    return false
  }

  // Use state to set and save the selection of the user
  userGameState.setGameState(currentUser, currentUserAvatar, roomCodeArr, false, 0, 0, false)
}
</script>

<style scoped>
.settings-button {
  border-radius: 50%;
  justify-content: center;
  padding: 5px 5px 5px 5px;
  border-width: 5px;

  position: relative; /* or 'relative' depending on your layout */
  top: 20px;   /* moves it down */
  left: 20px;   /* moves it to the left */

  margin: auto;
}

.settings-button:hover {
  background-color: #c0c3c1;
  transform: scale(1.05);
}

.settings-button:active {
  background-color: #1d1c1c;
  transform: scale(1.05);
}

.settings-img {
  width: 60px;
  height: 55px;
}

.blurred {
  filter: blur(5px);
  pointer-events: none;
  user-select: none;
}

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

.bottom-buttons{
  display: flex;
  flex-direction: column;
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