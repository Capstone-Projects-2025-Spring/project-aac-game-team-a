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
    <RouterLink to="/hostLobby">Host Lobby</RouterLink>
    <RouterLink to="/joinLobby">Join Lobby</RouterLink>
  </div>
</template>

<style scoped>
@media (min-width: 1024px){
  .lobbyButtons{
    display: flex;
    flex-direction: column;
  }
}
</style>
