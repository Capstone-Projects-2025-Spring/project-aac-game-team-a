import { defineStore } from 'pinia' // Import pinia to use as local state for the game

// Define export to use in other files
export const GameState = defineStore('game', { 
  // Define the variables to save the state of
  state: () => ({
    currentUser: '',
    currentUserAvatar: '',
    roomCode: ''
  }),
  // Define a method to set variables
  actions: {
    setUser(user, avatar, code) {
      this.currentUser = user
      this.currentUserAvatar = avatar
      this.roomCode = code
    }
  }
})