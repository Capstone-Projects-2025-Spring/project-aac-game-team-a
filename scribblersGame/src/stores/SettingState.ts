import { defineStore } from 'pinia' // Import pinia to use as local state for the settings

// Define export to use in other files
export const SettingState = defineStore('settings', { 
    state: () => ({
        enableTTS: true, // Text to speech should be enabled from the start
        pathToTTSimg: '/TTSenabled.png', // TTS image should show enabled
      }),
    // Define a method to set variables
    actions: {
        // Method to set the mode of text-to-speech for the user
        setModeTTS(enableTTS) {
            this.enableTTS = enableTTS

            // set the correct image based on the mode set
            if(this.enableTTS == true){
                this.pathToTTSimg = '/TTSenabled.png'
            } else {
                this.pathToTTSimg = '/TTSdisabled.png'
            }
        }
    }
  })