<template>
  <div class="host-screen">
    <h1>Host a New Game</h1>

    <!-- Game visibility selection -->
    <div class="form-group">
      <label>Game Visibility</label>
      <select v-model="visibility">
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
    </div>

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
    <button class="launch-btn" @click="launchRoom"> Launch Room</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Game visibility state (public or private)
const visibility = ref('public')

// Maximum number of players allowed in the room
const maxPlayers = ref(4)

// Number of rounds for the game
const rounds = ref(3)

// Function to launch the game room (placeholder for logic)
function launchRoom() {
  alert(
    `Launching ${visibility.value} room with ${maxPlayers.value} players and ${rounds.value} rounds`
  )
}
</script>

<style scoped>
/* Host screen container styling */
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

/* Heading styling */
h1 {
  font-size: 2rem;
  margin-bottom: 30px;
  color: #333;
}

/* Form group spacing and layout */
.form-group {
  margin-bottom: 20px;
  text-align: left;
}

/* Form label styling */
label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: bold;
}

/* Styling for select dropdowns and number inputs */
select,
input[type='number'] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

/* Focus styling for inputs and select fields */
select:focus,
input:focus {
  border-color: #007bff;
  outline: none;
}

/* Launch room button styling */
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

/* Launch room button hover effect */
.launch-btn:hover {
  background-color: #1c7c31;
  transform: translateY(-2px);
}
</style>
