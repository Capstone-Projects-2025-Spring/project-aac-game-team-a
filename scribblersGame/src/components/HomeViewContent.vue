<script setup lang="ts">
</script>

<template>
  <div class="home-elements">
    <h1 class="welcome-text">Welcome to Scribbers!</h1>
    <div class="lobby-buttons">
      <RouterLink to="/hostLobby" class="host-lobby-button">Host Lobby</RouterLink>
      <RouterLink to="/joinLobby" class="join-lobby-button">Join Lobby</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.home-elements {
  max-width: 500px;
  margin: 200px auto;
  width: 50%;
  padding: 40px;
  background-color: #fff;
  border-radius: 20px;
  border-color: black;
  border-style: solid;
  border-width: 3px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}

.lobby-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 50px;
}

.join-lobby-button {
  display: inline-block;
  padding: 12px 24px;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background-color: #28a745;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.3s, transform 0.2s;
  width: 200px;
}

.join-lobby-button:hover {
  background-color: #1c7c31;
  transform: scale(1.05);
}

.host-lobby-button {
  display: inline-block;
  padding: 12px 24px;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background-color: #28a745;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.3s, transform 0.2s;
  width: 200px;
}

.host-lobby-button:hover {
  background-color: #1c7c31;
  transform: scale(1.05);
}

.welcome-text {
  position: relative;
  font-size: 3rem;
}
</style>
