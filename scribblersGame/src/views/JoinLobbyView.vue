<template>
  <div class="join-screen">
    <h1>Join a Game</h1>

    <div class="form-group">
      <label>Room Code</label>
      <input type="text" v-model="roomCode" placeholder="Enter room code" maxlength="16" />
    </div>

    <div class="form-group">
      <label>Choose Your Avatar</label>
      <div class="avatar-container">
        <button
          v-for="(button, index) in landingPageButtons"
          :key="index"
          @click="selectAvatar(button)"
          :class="['avatar-button', { selected: currentUserAvatar === button.imgSrc }]"
        >
          <img :src="button.imgSrc" :alt="button.label" />
          <p>{{ button.label }}</p>
        </button>
      </div>
    </div>

    <RouterLink to="/avatar" class="join-btn" @click="joinGame">Join Game</RouterLink>
  </div>
</template>


<script setup>
import { ref } from 'vue'

// Store room code input
const roomCode = ref('')

// Store current user's name and avatar
const currentUser = ref('')
const currentUserAvatar = ref('')

// Avatar options with image source and label
const landingPageButtons = [
  { id: 1, imgSrc: 'lion.png', label: 'Lion' },
  { id: 2, imgSrc: 'tiger.webp', label: 'Tiger' },
  { id: 3, imgSrc: 'bear.png', label: 'Bear' },
  { id: 4, imgSrc: 'monkey.png', label: 'Monkey' },
  { id: 5, imgSrc: 'gorilla.png', label: 'Gorilla' },
  { id: 6, imgSrc: 'eagle.png', label: 'Eagle' },
  { id: 7, imgSrc: 'cat.png', label: 'Cat' },
  { id: 8, imgSrc: 'dog.png', label: 'Dog' }
]

// Select an avatar and set user data
function selectAvatar(button) {
  currentUser.value = button.label
  currentUserAvatar.value = button.imgSrc
}


// Validate and attempt to join a game
function joinGame() {
  if (!roomCode.value || !currentUserAvatar.value) {
    alert('Please enter a room code and select an avatar.')
    return
  }
  alert(`Joining room ${roomCode.value} as ${currentUser.value}`)
  // Add navigation or join logic here
}
</script>


<style scoped>
/* Join screen container styling */
.join-screen {
  max-width: 500px;
  margin: 80px auto;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}


/* Heading styling */
h1 {
  font-size: 2rem;
  margin-bottom: 30px;
  color: #333;
}

/* Form group spacing and layout */
.form-group {
  margin-bottom: 30px;
  text-align: left;
}

/* Form label styling */
label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: bold;
}

/* Room code input styling */
input[type='text'] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

/* Input focus highlight */
input:focus {
  border-color: #007bff;
  outline: none;
}


/* Avatar container grid layout with 4 buttons per row */
.avatar-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  justify-items: center;
  margin-top: 10px;
}


/* Avatar button styling */
.avatar-button {
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  transition: border-color 0.3s, transform 0.2s;
  text-align: center;
  width: 100px;
}


/* Avatar image styling inside button */
.avatar-button img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 5px;
}

/* Avatar label styling */
.avatar-button p {
  margin: 0;
  font-size: 0.9rem;
}

/* Avatar button hover effect */
.avatar-button:hover {
  transform: scale(1.05);
}

/* Selected avatar button styling */
.avatar-button.selected {
  border-color: #007bff;
  background-color: #f0f8ff;
}


/* Join Game button styling */
.join-btn {
  margin-top: 25px;
  padding: 12px 20px;
  font-size: 1.1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.2);
  transition: background-color 0.3s, transform 0.1s;
}

/* Join Game button hover effect */
.join-btn:hover {
  background-color: #1c7c31;
  transform: translateY(-2px);
}
</style>
