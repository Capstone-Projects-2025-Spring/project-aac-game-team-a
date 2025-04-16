<script>
import { SettingState } from '@/stores/SettingState'

export default {
  data () {
    return {
      settingsState: null, // Intialize a variable for the settings
    }
  },
  created() {
    this.settingsState = SettingState() // Set the settings to the current state
  },
  methods: {
    // Called to turn text into speech
    speakNow(textToSpeak) {
      // Only use text-to-speech if enabled
      if(this.settingsState.enableTTS){
        const utterance = new SpeechSynthesisUtterance(textToSpeak); // Synthesize the speech
        utterance.lang = 'en'; // Specify the language
        speechSynthesis.speak(utterance); // Speak fido
      }
    },

    // Handles the clicks per button
    handleClick(text, route) {
      // Turn text to speech
      this.speakNow(text)
      // Timeout before routing
      setTimeout(() => {
        // Route to page
        this.$router.push(route)
      }, 500) // wait for speech to begin before navigating
    },

    // Toggles text to speech locally for user
    toggleTTS(){
      if (this.settingsState.enableTTS == true){
        this.settingsState.setModeTTS(false)
      } else {
        this.settingsState.setModeTTS(true)
      }
    }
  }
}
</script>

<template class="everything">
  <div class="home-elements">
    <h1 @click="speakNow('Welcome to Scribblers!')" class="welcome-text">Welcome to Scribblers!</h1>
    <div class="lobby-buttons">
      <button @click="handleClick('Join Lobby', '/joinLobby')" class="join-lobby-button">Join Lobby</button>
      <button @click="handleClick('Create Lobby', '/hostLobby')" class="create-lobby-button">Create Lobby</button>
    </div>
  </div>
  <div class="settings-elements">
    <!-- Toggles text to speech in home screen -->
    <button @click="toggleTTS" class="toggle-tts" :class="{ 'tts-on': settingsState.enableTTS, 'tts-off': !settingsState.enableTTS }">
      <img v-bind:src=settingsState.pathToTTSimg class="toggle-tts-img">
    </button>
  </div>
</template>

<style scoped>
.home-elements {
  max-width: 500px;
  margin: 100px auto 20px auto; 
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

.create-lobby-button {
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

.create-lobby-button:hover {
  background-color: #1c7c31;
  transform: scale(1.05);
}

.welcome-text {
  position: relative;
  font-size: 3rem;
}

.settings-elements{
  max-width: 500px;
  margin: 0 auto 40px auto;
  width: 25%;
  padding: 20px;
  background-color: #fff;
  border-radius: 20px;
  border: 3px solid black;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}

.toggle-tts {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #fff;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease;
}

.tts-on {
  border: 4px solid #28a745; /* green when on */
}

.tts-off {
  border: 4px solid #dc3545; /* red when off */
}

.toggle-tts:hover {
  transform: scale(1.05);
}

.toggle-tts-img {
  width:50px;
  height:55px;
}
</style>
