<script setup>
    import { SettingState } from '@/stores/SettingState'

    const settingsState = SettingState();
    const props = defineProps(['playerDataMap', 'time', 'currentRound', 'totalRounds', 'roomCodeArr', 'getShapeImage', 'getShapeLabel', 'speakRoomCode','currentDrawer' ]);
    
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
</script>

<template>
    <div class="chat-container">
        <!-- Room code -->
        <div class="room-code-section" @click="props.speakRoomCode">
            <span class="room-code-label">Room Code:</span>
            <div class="room-code-shapes">
                <img
                    v-for="(digit, index) in props.roomCodeArr"
                    :key="index"
                    :src="props.getShapeImage(digit)"
                    :alt="props.getShapeLabel(digit)"
                    class="room-code-shape"
                />
            </div>
        </div>

        <!-- Game status info -->
        <div @click="speakNow(props.time + ' seconds left')" class="timer-section">
           ⏳ Timer: {{ props.time }}
        </div>
        <div @click="speakNow('Round '+props.currentRound+' out of '+ props.totalRounds)" class="rounds-section">
            Round: {{ props.currentRound }} / {{ props.totalRounds }}
        </div>
        
        <!-- Player guesses -->
        <div v-for="[player, data] of props.playerDataMap" :key="player" class="chat-guess">
            <!-- Display the score -->
            Score: {{ data.score }}

            <div class="player-data">
                <img @click="speakNow('player '+player)" :src="player.toLowerCase() + '.png'" :alt="player" class="game-avatar-image" />
                <h1 v-if="player != props.currentDrawer">
                    <div @click="speakNow(data.currentGuess)">
                        {{data.currentGuess}}
                        <img 
                            v-if="data.currentGuessImagePath" 
                            :src="data.currentGuessImagePath" 
                            alt="guess icon" 
                            class="guess-icon-image"
                        />
                    </div>
                </h1>
                <div v-if="player == props.currentDrawer" @click="speakNow('player '+player+ ' is drawing')" class="drawer-indicator">Drawer ✏️</div>
            </div>
        </div>
    </div>
</template>

<!-- Styling for the guess board -->
<style scoped>
    .chat-container {            
        background-color: #c9c6c6;
        box-sizing: border-box;
        border: 5px solid black;
        border-radius: 25px;
        resize: none;
        width: 300px;

        height: auto;
        min-height: 320px;
        max-height: 80vh;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 10px;
        gap: 10px;

        z-index: 10;

        font-weight: bold;
        font-family: 'Segoe UI', sans-serif;
    }

    .room-code-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 10px auto;
        padding: 8px;
        background-color: #f5f5f5;
        border-radius: 12px;
        border: 2px solid #333;
        width: 90%;
        cursor: pointer;
    }

    .room-code-label {
        font-weight: bold;
        font-family: 'Segoe UI', sans-serif;
    }

    .room-code-shapes {
        display: flex;
        gap: 0.3rem;
        justify-content: center;
    }

    .room-code-shape {
        width: 45px;
        height: 45px;
        object-fit: contain;
    }

    .timer-section{
        font-size: 40px;
    }

    .rounds-section{
        font-size: 40px;
    }

    .chat-guess {
        /* border: 3px solid rgb(0, 0, 0); */
        background-color: rgb(227, 227, 227);
        border-radius: 25px;
        font-weight: bold;
        font-family: 'Segoe UI', sans-serif;
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 3px;
    }

    .player-data{
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
        gap: 3px;
    }

    .game-avatar-image {
        width: auto;
        height: 50px;
        padding-left: 1rem;
    }

    .guess-guess {
        padding-top: 0.9rem;
        font-weight: bold;
        font-family: 'Segoe UI', sans-serif;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }

    .guess-icon-image {
        height: 50px;
        width: 50px;
        margin: 0 8px;
        vertical-align: middle;
    }

    .guess-symbol {
        width: 60px;
        height: 60px;
        margin-left: auto;
        padding-right: 1rem;
    }
    .drawer-indicator {
        font-size: 1.8rem; /* Increase the font size to make the pencil bigger */
        margin-right: auto; /* Push it to the right side */
        padding-right: 1rem; /* Add some padding */
        font-weight: bold;
    }
</style>