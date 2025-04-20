<template>
    <div class="settings-overlay" @click.self="close">
        <div class="settings-box">
            <h2 class="title" @click="speakNow('Settings')">
                Settings
            </h2>

            <!-- Toggle TTS button -->
            <button 
            @click="toggleTTS()" 
            class="toggle-tts" 
            :class="{ 'tts-on': settingsState.enableTTS, 'tts-off': !settingsState.enableTTS }">
                <img :src="settingsState.pathToTTSimg" class="toggle-tts-img">
            </button>

            <!-- TTS Volume slider -->
            <div class="slider-box">
                <label @click="speakNow('Speech Volume<')" for="TTSvolume" class="slider-label">Speech Volume</label>
                <input
                    id="TTSvolume"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    :value="settingsState.volumeTTS"
                    @input="updateVolume($event)"
                    class="opacity-slider"
                />
            </div>

            <!-- Background opacity slider -->
            <div class="slider-box">
                <label @click="speakNow('Background opacity')" for="bgOpacity" class="slider-label">Background Opacity</label>
                <input
                    id="bgOpacity"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    :value="settingsState.backgroundOpacity"
                    @input="updateOpacity($event)"
                    class="opacity-slider"
                />
            </div>

            <!-- Close settings -->
            <button @click="close" class="close-settings">Close Settings</button>
        </div>
        <div class="settings-elements">
            
        </div>
    </div>
</template>

<script>
    import { SettingState } from '@/stores/SettingState'

    export default {
        setup() {
            // Define the state for settings
            const settingsState = SettingState()

            // Toggles the text-to-speech
            const toggleTTS = () => {
                // Works when turning off TTS
                if(settingsState.enableTTS){
                    speakNow('Speech off')
                } 

                // Flip TTS ability
                settingsState.setModeTTS(!settingsState.enableTTS)

                // Works when turning on TTS
                if(settingsState.enableTTS){
                    speakNow('Speech on')
                } 
            }

            // Used for the TTS volume on settings overlay
            const updateVolume = (e) => {
                const newVolume = parseFloat(e.target.value)
                settingsState.setVolumeTTS(newVolume)
            }

            // Used for background opacity
            const updateOpacity = (e) => {
                const newOpacity = parseFloat(e.target.value)
                settingsState.setBackgroundOpacity(newOpacity)
            }

             // Called to turn text into speech
            const speakNow = (textToSpeak) => {
                // Cancel any current TTS
                speechSynthesis.cancel();
                // Only use text-to-speech if enabled and the string does not contain 'null'
                if(settingsState.enableTTS && !textToSpeak.includes('null')){
                    const utterance = new SpeechSynthesisUtterance(textToSpeak); // Synthesize the speech
                    utterance.volume = settingsState.volumeTTS // Set the volume of speech
                    utterance.lang = 'en'; // Specify the language
                    speechSynthesis.speak(utterance); // Speak fido
                }
            }

            // Closes the settings popup
            const close = () => {
                speakNow('Close settings')
                settingsState.toggleSettings()
            }

            return { settingsState, toggleTTS, close, updateVolume, updateOpacity, speakNow }
        },
    }
</script>

<style scoped>
    .settings-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.6); /* semi-transparent black */
        z-index: 999;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: auto;
        font-family: 'Segoe UI', sans-serif;
    }
    .settings-box {
        width: 200px;
        background: white;
        padding: 3rem;
        border: 3px solid black;
        border-radius: 25px;
        z-index: 1000;

        display: flex;
        flex-direction: column;
        align-items: center;

        gap: 1rem;
    }
    
    .toggle-tts {
        width: 100%;
        height: 50px;
        border-radius: 25px;
        background-color: #fff;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.2s ease;
    }

    .tts-on {
        border: 3px solid #28a745; /* green when on */
    }

    .tts-off {
        border: 3px solid #dc3545; /* red when off */
    }

    .toggle-tts:hover {
        transform: scale(1.05);
    }

    .toggle-tts-img {
        width:50px;
        height:55px;
    }

    .slider-box{
        border: 3px solid;
        border-radius: 25px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .slider-label {
        margin-bottom: 0.5rem;
        margin-top: 0.5rem;
        font-weight: bold;
    }

    .opacity-slider {
        width: 90%;
        margin-bottom: 1rem;
    }

    .close-settings {
        width: 50%;
        height: 20%;
        border-radius: 25px;
        border:3px solid;
        font-weight: bold;
        background-color: #dc3545;
        color: white;
        padding-bottom: 0.6rem;
        padding-top: 0.6rem;
    }

    .close-settings:hover {
        transform: scale(1.05);
        background-color: #c12c3b;
    }
</style>
