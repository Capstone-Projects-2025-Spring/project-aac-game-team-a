import { defineStore } from 'pinia' // Import pinia to use as state for the settings

// Define export to use in other files
export const SettingState = defineStore('settings', { 
    state: () => ({
        showSettings: false, // Used to enable the settings overlay

        enableTTS: true, // Text to speech should be enabled from the start
        pathToTTSimg: '/TTSenabled.png', // TTS image should show enabled
        backgroundOpacity: 0,
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
        },

        // Change the opacity of the background
        setBackgroundOpacity(value: number) {
            this.backgroundOpacity = value
            document.documentElement.style.setProperty('--bg-opacity', value.toString())
        },        

        // Method to set the overlay to active or inactive
        toggleSettings(){
            this.showSettings = !this.showSettings
        },
    }
  })