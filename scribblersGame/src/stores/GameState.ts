import { defineStore } from 'pinia' // Import pinia to use as local state for the game

// Define export to use in other files
export const GameState = defineStore('game', { 
  // Define a method to set variables
  actions: {
    setUser(user, avatar, code, isHost, maxPlayers, rounds, isHostPlaying) {
      this.currentUser = user
      this.currentUserAvatar = avatar
      this.roomCode = code
      this.isHost = isHost 
      this.maxPlayers = maxPlayers
      this.rounds = rounds
      this.isHostPlaying = isHostPlaying
    }
  }
})