<template>
  <div class="host-screen">
    <h1>Host a New Game</h1>

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
    <RouterLink 
      :to="{
        path: '/roomlobby',
        query: { maxPlayers: maxPlayers, rounds: rounds }
      }"
      class="launch-btn" 
      @click="launchRoom"
    >
      Launch Room
    </RouterLink>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const maxPlayers = ref(4)
const rounds = ref(3)

function launchRoom() {
  alert(
    `Hosting room with max ${maxPlayers.value} players and ${rounds.value} rounds`
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
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.2);
  transition: background-color 0.3s, transform 0.1s;
}

.launch-btn:hover {
  background-color: #1c7c31;
  transform: translateY(-2px);
}
</style>
