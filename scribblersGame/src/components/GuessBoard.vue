<script setup>
    const props = defineProps(['playerDataMap', 'time', 'currentRound', 'totalRounds']);
</script>

<template>
    <div class="chat-container">                
        <!-- Loop through messageBoard array and display
            Each user avatar
            Each user guess
            Each symbol associated with the guess
        -->
        <h1>
            Timer: {{ props.time }}
            Round: {{ props.currentRound }} / {{ props.totalRounds }}
        </h1>
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
        width: 250px;

        height: auto;
        min-height: 150px;
        max-height: 80vh;
        overflow-y: auto;

        display: flex;
        flex-direction: column;
        align-items: flex-start;        /* Horizontal centering */
        justify-content: center;    /* Vertical centering */
        text-align: center;         /* Optional: centers inline text */
    }

    .chat-guess {
        display: flex;
        flex-direction: row;
    }

    .game-avatar-image {
        width: auto; /* Adjust the image size */
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