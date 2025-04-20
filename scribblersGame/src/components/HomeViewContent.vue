<script>
import { SettingState } from '@/stores/SettingState'
import SettingsOverlay from '@/components/SettingsOverlay.vue'

export default {
  components:{
    SettingsOverlay
  },
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
      // Cancel any current TTS
      speechSynthesis.cancel();
      // Only use text-to-speech if enabled and the string does not contain 'null'
      if(this.settingsState.enableTTS && !textToSpeak.includes('null')){
        const utterance = new SpeechSynthesisUtterance(textToSpeak); // Synthesize the speech
        utterance.volume = this.settingsState.volumeTTS // Set the volume of speech
        utterance.lang = 'en'; // Specify the language
        speechSynthesis.speak(utterance); // Speak fido
      }
    },

    // Handles the clicks per button
    handleClick(text, route) {
      // Turn text to speech
      this.speakNow(text)
      // Navigate to required page
      this.$router.push(route)
    },
  }
}
</script>

<template>
  <!-- Opens the settings overlay -->
  <button @click="settingsState.toggleSettings()" class="settings-button" :class="{ 'blurred': settingsState.showSettings }"> 
    <img @click="speakNow('Settings')" src="/settingsIcon.png" class="settings-img">
  </button>

  <!-- Main buttons -->
  <div class="home-elements" :class="{ 'blurred': settingsState.showSettings }">
    <h1 @click="speakNow('Welcome to Scribblers!')" class="welcome-text">Welcome to Scribblers!</h1>
    <div class="lobby-buttons">
      <button @click="handleClick('Join Lobby', '/joinLobby')" class="join-lobby-button">Join Lobby</button>
      <button @click="handleClick('Create Lobby', '/hostLobby')" class="create-lobby-button">Create Lobby</button>
    </div>
  </div>

  <!-- Show Settings Overlay -->
  <SettingsOverlay v-if="settingsState.showSettings" />

</template>

<style scoped>
.settings-button {
  border-radius: 50%;
  justify-content: center;
  padding: 5px 5px 5px 5px;
  border-width: 5px;

  position: relative; /* or 'relative' depending on your layout */
  top: 20px;   /* moves it down */
  left: 20px;   /* moves it to the left */

  margin: auto;
}

.settings-button:hover {
  background-color: #c0c3c1;
  transform: scale(1.05);
}

.settings-button:active {
  background-color: #1d1c1c;
  transform: scale(1.05);
}

.settings-img {
  width: 60px;
  height: 55px;
}

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

.blurred {
  filter: blur(5px);
  pointer-events: none;
  user-select: none;
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
