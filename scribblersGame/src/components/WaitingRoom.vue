<template>
  <div class="waiting-room">
    <h1>Game Lobby</h1>
    
    <div class="room-info">
      <div class="room-code">
        <h2>Room Code:</h2>
        <div class="shape-code-display">
          <div v-for="(digit, index) in roomCode" :key="index" class="shape-slot">
            <img :src="getShapeImg(parseInt(digit))" />
          </div>
        </div>
      </div>
      
      <div class="game-config">
        <p v-if="isHost"><strong>Players:</strong> {{ playerCount }}/{{ maxPlayers }}</p>
        <p v-if="isHost"><strong>Rounds:</strong> {{ rounds }}</p>
      </div>
    </div>
    
    <div class="players-section">
      <h2>Players ({{ playerCount }}/{{ maxPlayers }})</h2>
      
      <div class="host-status" v-if="isHost && !isHostPlaying">
        <p class="host-observing">You are observing this game (not playing)</p>
      </div>
      
      <div class="players-list">
        <!-- Current user (only show in player list if host is playing or if user is not host) -->
        <div v-if="isHostPlaying || !isHost" class="player">
          <img :src="userAvatar" :alt="userName" class="player-avatar" />
          <p>{{ userName }} <span v-if="isHost">(Host)</span></p>
        </div>
        
        <!-- Joined players list -->
        <div v-for="(player, index) in joinedPlayers" :key="index" class="player">
          <img :src="player.avatar" :alt="player.name" class="player-avatar" />
          <p>{{ player.name }}</p>
        </div>

        <!-- Empty state message when no players have joined -->
        <div v-if="playerCount === 0" class="empty-players">
          <p>Waiting for players to join...</p>
        </div>
      </div>
    </div>
    
    <div class="bottom-buttons">
      <!-- Only host can start the game -->
      <RouterLink 
        v-if="isHost && playerCount >= 2"
        :to="{
          path: '/game',
          query: { 
            user: userName, 
            avatar: userAvatar, 
            //roomCode: roomCode,
            isHost: isHost,
            isHostPlaying: isHostPlaying,
            maxPlayers: maxPlayers,
            rounds: rounds
          }
        }"
        class="start-btn">
        Start Game
      </RouterLink>
      
      <RouterLink 
        v-if="isHost && playerCount < 2"
        to="#"
        class="disabled-btn"
        @click.prevent="showNotEnoughPlayersAlert">
        Start Game
      </RouterLink>
      
      <p v-if="!isHost" class="waiting-message">
        Waiting for host to start the game...
      </p>
      
      <RouterLink 
        :to="{
          path: '/',
        }"
        class="leave-btn"
        @click="leaveLobby">
        Leave Lobby
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

//define the emit function to send events to parent
const emit = defineEmits();
const props = defineProps(['roomCode']);

// Extract query parameters
const userName = ref(route.query.user || '')
const userAvatar = ref(route.query.avatar || '')
const isHost = ref(route.query.isHost === 'true')
const isHostPlaying = ref(route.query.isHostPlaying === 'true')
const maxPlayers = ref(parseInt(route.query.maxPlayers) || 8)
const rounds = ref(parseInt(route.query.rounds) || 5)

// Mock joined players array for now
const joinedPlayers = ref([])

// Calculate player count
const playerCount = computed(() => {
  // Start with joined players count
  let count = joinedPlayers.value.length
  
  // Add current user to count if they are playing
  if (isHost.value) {
    // Only count host if they're playing
    if (isHostPlaying.value) {
      count += 1
    }
  } else {
    // Always count non-host users
    count += 1
  }
  
  return count
})

// Shape map
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

function getShapeImg(digit) {
  const found = shapes.find((s) => s.value === digit)
  return found ? found.imgSrc : ''
}

function showNotEnoughPlayersAlert() {
  alert('Need at least 2 players to start the game!')
}

function leaveLobby(){
  emit("leaveLobby");
}
// For testing: uncomment to add mock players
/*
onMounted(() => {
  joinedPlayers.value = [
    { name: 'Player 1', avatar: 'lion.png' },
    { name: 'Player 2', avatar: 'tiger.webp' }
  ]
})
*/

onMounted(() => {
  console.log("Waiting room mounted, isHostPlaying:", isHostPlaying.value)
  console.log("Current player count:", playerCount.value)
})
</script>

<style scoped>
.waiting-room {
  max-width: 600px;
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
  font-size: 2.2rem;
  margin-bottom: 30px;
  color: #333;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #444;
}

.room-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 15px;
}

.room-code {
  text-align: center;
}

.shape-code-display {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.shape-slot {
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

.shape-slot img {
  width: 35px;
  height: 35px;
}

.game-config {
  text-align: left;
}

.game-config p {
  margin: 5px 0;
  font-size: 1.1rem;
}

.players-section {
  margin-bottom: 30px;
}

.host-status {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #e9ecef;
  border-radius: 10px;
}

.host-observing {
  color: #6c757d;
  font-style: italic;
  margin: 0;
}

.players-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.empty-players {
  grid-column: 1 / -1;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  font-style: italic;
  color: #6c757d;
}

.player {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background-color: #f0f8ff;
  border-radius: 15px;
  transition: transform 0.2s;
}

.player:hover {
  transform: translateY(-5px);
}

.player-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-bottom: 10px;
  object-fit: cover;
  border: 2px solid #007bff;
}

.player p {
  margin: 0;
  font-weight: bold;
}

.bottom-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.start-btn {
  padding: 12px 30px;
  font-size: 1.2rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 12px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 200px;
}

.start-btn:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

.disabled-btn {
  padding: 12px 30px;
  font-size: 1.2rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 12px;
  text-decoration: none;
  cursor: not-allowed;
  opacity: 0.7;
  width: 200px;
}

.leave-btn {
  padding: 12px 30px;
  font-size: 1.2rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 12px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  width: 200px;
}

.leave-btn:hover {
  background-color: #c82333;
  transform: translateY(-2px);
}

.waiting-message {
  font-size: 1.1rem;
  color: #6c757d;
  margin-bottom: 10px;
  font-style: italic;
}
</style>