<script>
    export default{
        // Declare prop varibales to be used by other classes
        props: [
            'guesses',
        ],
    }
</script>

<template>
    <div class="chat-container">                
        <!-- Loop through messageBoard array and display
            Each user avatar
            Each user guess
            Each symbol associated with the guess
        -->
        <div v-for="guess in guesses" :key="guess.id" class="chat-guess">
            <img :src="guess.avatar" :alt="guess.user" class="game-avatar-image" />
            <span class="guess-guess">{{ guess.text }}</span>
            <img 
                v-if="guess.imagePath" 
                :src="guess.imagePath" 
                alt="Symbol" 
                class="guess-symbol" 
            />
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

    .guess-symbol {
        width: 50px;
        height: 50px;
        margin-left: auto;
        padding-right: 1rem;
    }
</style>