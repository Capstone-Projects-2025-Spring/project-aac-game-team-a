<script setup>
    const props = defineProps(['playerDataMap', 'time', 'currentRound', 'totalRounds', 'roomCodeArr', 'getShapeImage', 'getShapeLabel', 'speakRoomCode']);
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
        <h1>
            Timer: {{ props.time }}
            Round: {{ props.currentRound }} / {{ props.totalRounds }}
        </h1>
        
        <!-- Player guesses -->
        <div v-for="[player, data] of props.playerDataMap" :key="player" class="chat-guess">
            <img :src="player.toLowerCase() + '.png'" :alt="player" class="game-avatar-image" />
            <h1>
                {{data.currentGuess}}
                <img 
                    v-if="data.currentGuessImagePath" 
                    :src="data.currentGuessImagePath" 
                    alt="guess icon" 
                    class="guess-icon-image"
                />
                Score:{{data.score}}
            </h1>
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
        width: 300px; /* Made slightly wider to accommodate room code */

        height: auto;
        min-height: 150px;
        max-height: 80vh;
        overflow-y: auto;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        text-align: center;
        padding: 10px;
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
        margin-bottom: 5px;
        font-family: 'Segoe UI', sans-serif;
    }

    .room-code-shapes {
        display: flex;
        gap: 0.3rem;
        justify-content: center;
    }

    .room-code-shape {
        width: 50px;
        height: 50px;
        object-fit: contain;
    }

    .chat-guess {
        display: flex;
        flex-direction: row;
        width: 100%;
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
</style>