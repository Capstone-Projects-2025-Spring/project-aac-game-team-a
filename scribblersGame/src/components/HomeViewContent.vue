<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <div class="lobbyButtons">
    <RouterLink to="/hostLobby" class="lobbyButton">Host Lobby</RouterLink>
    <RouterLink to="/joinLobby" class="lobbyButton">Join Lobby</RouterLink>
  </div>
</template>

<style scoped>
.lobbyButtons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 50px;
}

.lobbyButton {
  display: inline-block;
  padding: 12px 24px;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.3s, transform 0.2s;
  width: 200px;
}

.lobbyButton:hover {
  background-color: #022142;
  transform: scale(1.05);
}

@media (min-width: 1024px){
  .lobbyButtons{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
