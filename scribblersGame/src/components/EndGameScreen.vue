<script setup>
    import { onMounted } from 'vue'
    import { SettingState } from '@/stores/SettingState'
    import { useRouter } from 'vue-router'

    // Define the emit function to send events to parent
    const emit = defineEmits(['playAgain']);
    // router to use for home button
    const router = useRouter()

    // Props to use
    const props = defineProps(['isHost']);

    // Define state of the settings
    const settingsState = SettingState();

    // Called to turn text into speech
    function speakNow(textToSpeak) {
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

    // Sends users back to the lobby to play again
    function playAgain() {
        speakNow('Back to lobby')
        emit("playAgain");
    }

    // Function to send a user back to the home screen
    function leaveLobby(){
        speakNow('Leave lobby')
        emit("leaveLobby");
        router.push({ path: '/' });  
    }
 
</script>

<template>

    <!-- Settings -->
    <button @click="settingsState.toggleSettings()" class="settings-button" :class="{ 'blurred': settingsState.showSettings }"> 
        <img @click="speakNow('Settings')" src="/settingsIcon.png" class="settings-img">
    </button>

    <div class="end-screen">
        <h1 @click="speakNow('Game Finished!')">Game Finished!</h1>

        <div class="bottom-buttons">
            <!-- Button for the host to send everyone back to the lobby -->
            <button @click="playAgain" v-if="props.isHost" class="back-to-lobby">Back to Lobby</button>

            <!-- Button to go to home -->
            <button 
                class="home-btn"
                @click="leaveLobby">
                Leave Lobby
            </button>
        </div>
        
    </div>
</template>

<style scoped>
    .end-screen{
        max-width: 600px;
        margin: 80px auto;
        padding: 40px;
        background-color: #ffffff;
        border-radius: 20px;
        border-style: solid;
        border-color: black;
        border-width: 3px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        text-align: center;
        font-family: 'Segoe UI', sans-serif;
        font-weight: bold;
    }

    .bottom-buttons {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
    }

    .back-to-lobby {
        padding: 12px 30px;
        font-size: 1.2rem;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 12px;
        text-decoration: none;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.1s;
        width: 200px;
        font-weight: bold;
    }

    .back-to-lobby:hover {
        background-color: #218838;
        transform: translateY(-2px);
    }

    .home-btn {
        padding: 12px 30px;
        font-size: 1.2rem;
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 12px;
        text-decoration: none;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.1s;
        width: 200px;
        font-weight: bold;
    }

    .home-btn:hover {
        background-color: #c82333;
        transform: translateY(-2px);
    }  
</style>