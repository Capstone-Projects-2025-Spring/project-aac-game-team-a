/**
 * This file stores game data in the front-end for multi-page access between JoinLobbyView, HostLobbyView, and GameView
 */
import { defineStore } from 'pinia' // Import pinia to use as local state for the game
export const GameState = defineStore('game', { // Define export to use in other files
  actions: {
    /**
     * Sets the values of a gameState object
     * @param user the current player
     * @param avatar the avatar selected to track the current player
     * @param code the lobby code the current player is attempting to connect to
     * @param isHost specifies whether current player is hosting
     * @param maxPlayers the max amount of player allowed in the lobby
     * @param rounds the number of rounds selected for the game
     * @param isHostPlaying specifies if the host will be added to the player queue or is a spectator
     */
    setGameState(user, avatar, code, isHost, maxPlayers, rounds, isHostPlaying) {
      this.currentUser = user
      this.currentUserAvatar = avatar
      this.roomCode = code
      this.isHost = isHost 
      this.maxPlayers = maxPlayers
      this.rounds = rounds
      this.isHostPlaying = isHostPlaying
    },
  }
})