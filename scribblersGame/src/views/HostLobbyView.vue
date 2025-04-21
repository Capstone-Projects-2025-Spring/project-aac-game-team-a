<template>
  <!-- Opens the settings overlay -->
  <button @click="settingsState.toggleSettings()" class="settings-button" :class="{ 'blurred': settingsState.showSettings }"> 
    <img @click="speakNow('Settings')" src="/settingsIcon.png" class="settings-img">
  </button>

  <div class="host-screen" :class="{ 'blurred': settingsState.showSettings }">
    <h1 @click="speakNow('Host a New Game')">Host a New Game</h1>

    <!-- Max players input -->
    <div class="form-group">
      <label @click="speakNow('Maximum Players')">Max Players</label>
      <input @input="validatePlayerCount()" @change="speakNow(maxPlayers + ' players')" type="number" v-model="maxPlayers" min="2" max="8"/>
    </div>

    <!-- Number of rounds input -->
    <div class="form-group">
      <label @click="speakNow('Number of Rounds')" >Number of Rounds</label>
      <input @input="validateRoundCount()" @change="speakNow(rounds + ' rounds')" type="number" v-model="rounds" min="1" max="10" />
    </div>

    <!-- Host participation toggle -->
    <div class="host-participation" v-if="!showAvatars">
      <button class="play-too-btn" @click="toggleAvatars(true)">I'm playing too</button>
    </div>

    <!-- Avatar selection (conditionally displayed) -->
    <div v-if="showAvatars" class="avatar-section">
      <div class="form-group">
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
      <button class="not-playing-btn" @click="toggleAvatars(false)">I'm not playing</button>
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
          path: '/',
      }"
      class="back-btn" @click="speakNow('Back')">Back</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { GameState } from '@/stores/GameState'
import { SettingState } from '@/stores/SettingState'

// Define state to send user data to Game
const userGameState = GameState();
// Define state of the settings
const settingsState = SettingState();

// Room setup state
const maxPlayers = ref(4)
const rounds = ref(3)
const randomCodeDigits = ref([])
const currentUser = ref('')
const currentUserAvatar = ref('')
const showAvatars = ref(false)
const isHostPlaying = ref(false)
const randomCodeString = computed(() => randomCodeDigits.value.join(''))

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

// Make sure the user doesn't go out of the range for players
function validatePlayerCount() {
  if (this.maxPlayers < 2 || this.maxPlayers > 8) {
    this.maxPlayers = null;  // Clears the value by setting it to null
  }
}

// Make sure the user doesn't go out of the range for rounds
function validateRoundCount() {
  if (this.rounds < 1 || this.rounds > 10) {
    this.rounds = null;  // Clears the value by setting it to null
  }
}

// Function to toggle avatar selection visibility
function toggleAvatars(show) {
  showAvatars.value = show
  isHostPlaying.value = show
  // Clear selected avatar if "not playing"
  if (!show) {
    currentUser.value = ''
    currentUserAvatar.value = ''
    speakNow("I'm not playing") // TTS
  } else {
    speakNow("I'm playing too") // TTS
  }
}

// Function to select an avatar
function selectAvatar(button) {
  currentUser.value = button.label
  currentUserAvatar.value = button.imgSrc
  speakNow(button.label) // TTS for avatar selected
}

function launchRoom() {
  speakNow("Launch room")
  const codeString = randomCodeDigits.value.join('')
  // Add actual hosting logic here

  // Use state to set and save the selection of the user
  userGameState.setGameState(currentUser, currentUserAvatar, codeString, true, maxPlayers, rounds, isHostPlaying)
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

.host-participation {
  margin: 30px 0;
}

.play-too-btn {
  padding: 12px 24px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.play-too-btn:hover {
  background-color: #0056b3;
}

.not-playing-btn {
  padding: 10px 20px;
  font-size: 0.9rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.not-playing-btn:hover {
  background-color: #5a6268;
}

.avatar-section {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 12px;
  background-color: #f9f9f9;
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

.disabled-btn {
  margin-top: 25px;
  padding: 12px 20px;
  font-size: 1.1rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 12px;
  text-decoration: none;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>