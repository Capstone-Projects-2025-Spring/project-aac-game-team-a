<script>
/**
 * Main file for game view. Waiting room and all game components render here based on game status
 */
//  IMPORTING
import AacBoard from '../components/aacBoard.vue';
import DrawingBoard from '../components/DrawingBoard.vue';
import WaitingRoom from '../components/WaitingRoom.vue';
import GuessBoard from "@/components/GuessBoard.vue";
import EndScreen from "@/components/EndGameScreen.vue";
import SocketClientHandler from "../objects/SocketClientHandler.js";
import { GameState } from '@/stores/GameState';
import { SettingState } from '@/stores/SettingState'

//  GAME SETTINGS
const inProduction = false; //change this variable to switch between connecting to public backend server and localhost
const socketServer =  "scribblersserver.fly.dev"; //web address for hosted websocket server
const testServer = window.location.hostname //set to IP address of front-end host
const SocketHandler = new SocketClientHandler;

export default {
    components: {
        AacBoard, //register Aac board as a component
        DrawingBoard, //register drawing board as a component
        WaitingRoom, //register waiting room as a component
        GuessBoard, //register the drawing board as a component
        EndScreen, //register the end game screen as a componenet
    },
    data() {
        //Check if roomCode is a string and split it, otherwise assume it's already an array
        let roomCodeArr = GameState().roomCode;

        if (typeof roomCodeArr  === 'string')
            roomCodeArr = roomCodeArr.split(',').map(Number);
        else if (Array.isArray(roomCodeArr))
            roomCodeArr = roomCodeArr.map(Number);
        
        return {
            showTimeRanOutPopup: false, //determines if this popup will be shown
            showAllGuessedCorrectPopup: false, //determines if this popup will be shown
            playerScore: 0, // Store the current score of the player
            settingsState: null, // Intialize a variable for the settings
            currentDrawer: "",
            isGuessCorrect: false, //tracks if current user has guessed correctly
            mappedPlayerData: new Map(), //tracks the current guesses submitted by all players 
            isDrawer: false, //track if user is the drawer
            isHost: GameState().isHost,
            isHostPlaying: GameState().isHostPlaying, //track if host is playing or spectating
            promptWord: "", //store the random drawing prompt word
            promptImgPath: "", // store the path to the image to be referenced for prompt
            context: null, // stores drawing context for drawing broadcasted data
            numRounds: GameState().rounds, // tracks number of rounds set by host
            currentRound: 0, //tracks the current round in the lobby
            maxPlayers: GameState().maxPlayers, // tracks maximum number of players allowed in lobby
            players: [], // string array of active players in lobby
            roundTimer: 0,  // tracks counter state
            roomCodeArr: roomCodeArr, // Now roomCodeArr is correctly assigned here
            roomCodeStr: roomCodeArr.join(''),
            gameStarted: false,
            gameEnded: false,
            AACboardDisabled: false, // Changed when the user incorrectly guesses
            AACboardDisabledDuration: 5000, // Amount of time for board to be disabled (1 sec = 1000 int)
            AACboardDisableTimer: 5,
            AACButtons: [// Buttons for game AAC board with associated images and labels
                {id: 1, imgSrc: 'lion.png', label: 'Lion'},
                {id: 2, imgSrc: 'tiger.webp', label: 'Tiger'},
                {id: 3, imgSrc: 'bear.png', label: 'Bear'}
            ],
            roomCodeShapes: [
                { value: 1, imgSrc: '/circle.png', label: 'Circle' },
                { value: 2, imgSrc: '/diamond.png', label: 'Diamond' },
                { value: 3, imgSrc: '/heart.png', label: 'Heart' },
                { value: 4, imgSrc: '/octagon.png', label: 'Octagon' },
                { value: 5, imgSrc: '/pentagon.png', label: 'Pentagon' },
                { value: 6, imgSrc: '/rectangle.png', label: 'Rectangle' },
                { value: 7, imgSrc: '/square.png', label: 'Square' },
                { value: 8, imgSrc: '/star.png', label: 'Star' },
                { value: 9, imgSrc: '/triangle.png', label: 'Triangle' }
            ],
        };
    },

    created() {
        this.settingsState = SettingState() // Set the settings to the current state
    },

    methods: {

        //called to show pop up message
        triggerAllGuessedCorrectPopup() {
            this.showAllGuessedCorrectPopup = true;
            setTimeout(() =>{
                this.showAllGuessedCorrectPopup = false;
            }, 4000); //4 seconds
        },

        //called to show pop up message
        triggerTimeRanOutPopup() {
            this.showTimeRanOutPopup = true;
            setTimeout(() =>{
                this.showTimeRanOutPopup = false;
            }, 4000); //4 seconds
        },

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

        // TTS for the room code
        speakRoomCode(){
            // Init a string for room code text
            let roomCodeText = ""
            // Loop through digits in string
            for(let i=0; i<this.roomCodeArr.length; i++){
                // Parse digits into int
                let digit = this.roomCodeArr[i]

                // Loop through shapes object array
                for (let j=0; j<this.roomCodeShapes.length; j++) {
                    
                    if(this.roomCodeShapes[j].value == digit){
                        // TTS the shape
                        roomCodeText += this.roomCodeShapes[j].label + " "
                        
                    }
                }
            }
            this.speakNow(roomCodeText)
        },
        getShapeImage(digit) {
            const shape = this.roomCodeShapes.find(shape => shape.value === digit);
            return shape ? shape.imgSrc : '';
            },
        getShapeLabel(digit) {
            const shape = this.roomCodeShapes.find(shape => shape.value === digit);
            return shape ? shape.label : '';
        },
    
        // Disconnects the user when called
        serverDisconnect(){
            try {
                this.playerCount = 0;
                this.speakNow('Quitting game')
                // Check if socket exists and is connected
                if (this.socketInstance && this.socketInstance.connected) {
                    // disconnect from game and server
                    this.socketInstance.emit("leave-room", this.roomCodeStr, GameState().currentUser);
                    this.socketInstance.disconnect(); // works like how "this.socketInstance.emit('disconnect')" should work
                    console.log("Disconnected from server.");
                } else {
                    console.warn("Socket is not connected or already null.");
                }
            } catch (error) {
                console.error("Error during disconnection:", error.message || error);
            }
        },
        
        // Function that handles a word selection on the AAC board 
        handleItemSelected({item, imagePath}) {

            // Only allow the action if the AAC board is not disabled
            if(!this.AACboardDisabled){
                console.log('Item selected:', item); //logs selected item
                this.mappedPlayerData.get(GameState().currentUser).currentGuess = item;
                this.mappedPlayerData.get(GameState().currentUser).currentGuessImagePath = imagePath;

                //If the user guesses the prompt correctly, display and emit to other sockets
                // else, disable the AAC board for 'AACboardDisabledDuration' amount of time
                if (item == this.promptWord){

                    // Player SCORE is calculatd as such
                    /* 
                        Current score += Floor( Current Time / 10 )
                        Ex:
                            Current score = 6
                            x = Floor ( 128 / 10 ) = 12
                            Current score += x
                            Current score = 18
                    */
                    this.playerScore += Math.floor(this.roundTimer/10)
                    this.mappedPlayerData.get(GameState().currentUser).score = this.playerScore

                    console.log(`You guessed correctly!`)
                    this.mappedPlayerData.get(GameState().currentUser).currentGuess = "Correct!";
                    this.mappedPlayerData.get(GameState().currentUser).currentGuessImagePath = '\correct.png';
                    this.isGuessCorrect = true;
                } else {
                    // Disable the AAC board
                    this.AACboardDisabled = true;

                    // Set the value to reset 
                    let reset = this.AACboardDisableTimer

                    // Used for the disabled AAC countdown
                    const interval = setInterval(() => {
                        this.AACboardDisableTimer -= 1
                        console.log(`Waiting... ${this.AACboardDisableTimer}s`);
                    }, 1000)


                    // Re-enable after x seconds
                    setTimeout(() => {
                    this.AACboardDisabled = false;
                    clearInterval(interval);
                    this.AACboardDisableTimer = reset
                    }, this.AACboardDisabledDuration);
                }

                this.socketInstance.emit('update-user-guess', 
                    this.roomCodeStr, 
                    GameState().currentUser, 
                    this.mappedPlayerData.get(GameState().currentUser).currentGuess,
                    this.mappedPlayerData.get(GameState().currentUser).currentGuessImagePath,
                    this.mappedPlayerData.get(GameState().currentUser).score
                )
            } else {
                // Let the user know the guess board is disabled
                console.log('AAC board disabled')
                this.speakNow('Guesses disabled')
            }
        },

        //  Handles sending initial drawing data to observer canvases (on mouse click)
        sendDrawDataInit(x, y, draw_color, draw_width) {
            this.socketInstance.emit('draw-init', this.roomCodeStr, x, y, draw_color, draw_width);
        },

        //  Handles sending drawing data to observer canvases (on mouse move)
        sendDrawData(x, y) {
            this.socketInstance.emit('draw', this.roomCodeStr, x, y);
        },

        //  Handles sending final drawing data to observer canvases (on mouse up)
        sendDrawDataEnd() {
            this.socketInstance.emit('draw-end', this.roomCodeStr);
        },

        //  Handles sending request to clear canvas
        sendDrawDataClear() {
            this.speakNow('Clear board')
            this.socketInstance.emit('draw-clear', this.roomCodeStr);
        },

        //  Handles sending request to clear undo canvas
        sendDrawDataUndo() {
            this.speakNow('Undo')
            this.socketInstance.emit('draw-undo', this.roomCodeStr);
        },

        //  Send request to start server timer
        sendTimerStart(length){
            if (this.roundTimer != 0) return;
            this.socketInstance.emit('timer-start', this.roomCodeStr, length);
        },

        //  Handles request for host to start game
        startGame() {
            //console.log("Starting game");
            this.gameStarted = true;
            this.gameEnded = false;
            this.socketInstance.emit("start-game", this.roomCodeStr);
        },

        // Handles sending users to lobby when they want to play again from the end game screen
        playAgain(){
            this.gameStarted = false;
            this.gameEnded = false;
            // Tells server to reset all scores
            this.socketInstance.emit("reset-scores", this.roomCodeStr)
            // Tells server to throw users back into the lobby to play again
            this.socketInstance.emit("play-again", this.roomCodeStr);
        },

        //  Handles request to leave lobby
        leaveLobby() {
            this.socketInstance.emit("leave-room", this.roomCodeStr, GameState().currentUser);
        },
    },
    // Automatically connect to the WebSocket server when the component is mounted
    mounted(){

        this.socketInstance = SocketHandler.connectSocketServer(socketServer, testServer, inProduction, this)
    },
    name: "GameView",
};
</script>

<template>
    <!--Display waiting room in between games-->
    <div v-if="!gameStarted && !gameEnded" class="waiting-room">
        <WaitingRoom
            @startGame="startGame"
            @leaveLobby="leaveLobby"
            :roomCode="roomCodeArr"
            :maxPlayers="maxPlayers"
            :players="players"
            :numRounds="numRounds"
            :isHost="isHost"
            :isHostPlaying="isHostPlaying">
        </WaitingRoom>
    </div>

    <!--Display game while started-->
    <div v-if="gameStarted && !gameEnded"> 

        <!-- Top info -->
        <div class="top-info">
            <!-- Opens the settings overlay -->
            <button @click="settingsState.toggleSettings()" class="settings-button" :class="{ 'blurred': settingsState.showSettings }"> 
                <img @click="speakNow('Settings')" src="/settingsIcon.png" class="settings-img">
            </button>

            <!-- Quit Button -->
            <RouterLink 
            :to="{
                path: '/', // Navigates to the home route
            }"
            @click="serverDisconnect"
            class="quit-btn">
            QUIT ❌</RouterLink>
        </div>

        <div  class="game-container">

        <!-- Popup: Everyone Guessed Correctly -->
        <div v-if="showAllGuessedCorrectPopup" class="popup-box">
            <p>🎉🎉🎉 <br>Everyone Guessed Correctly!</p>
        </div>

        <!-- Popup: Time Ran Out -->
        <div v-if="showTimeRanOutPopup" class="popup-box">
            <p>⏰ <br>Time Ran Out!</p>
        </div>

        <!-- Left side: Drawing canvas and button box -->
        <div class="left-container">
            <!--Display drawing prompt for drawer-->
            <div v-if="isDrawer" class="draw-prompt" @click="speakNow('Draw this')">
                <h2>DRAW: {{ promptWord }}</h2>
                <img class='prompt-image' :src=promptImgPath :alt=promptWord >
            </div>
            <!--You are guessing for guesser-->
            <div v-if="!isDrawer" class="guess-indicator" @click="speakNow('guess the drawing')">
                <h2>Guess the Drawing!</h2>
            </div>

            <!-- Display Drawing board -->
            <div class="drawing-box">
                <DrawingBoard 
                    class="drawing-board"
                    @startDrawData="sendDrawDataInit" 
                    @addDrawData="sendDrawData" 
                    @endDrawData="sendDrawDataEnd"
                    @canvasClear="sendDrawDataClear"
                    @canvasUndo="sendDrawDataUndo"
                    :isDrawer=this.isDrawer>
                </DrawingBoard>
            </div>

            <div v-if="!isDrawer && !isGuessCorrect" class="aac-board-box">
                <!-- AacBoard component is rendered here and we catch item selections here.-->
                <AacBoard 
                    @itemSelected="handleItemSelected"
                    :disabled="AACboardDisabled"
                    :time-disabled="AACboardDisableTimer"/>
            </div>
        </div>

            <div class="right-container">
                <!-- Assign the messageBoard in this class to the messageBoard in the MessageBoard component -->
                <GuessBoard 
                    :playerDataMap=this.mappedPlayerData
                    :time="roundTimer"
                    :currentRound="currentRound"
                    :totalRounds="numRounds"
                    :roomCodeArr="roomCodeArr"
                    :getShapeImage="getShapeImage"
                    :getShapeLabel="getShapeLabel"
                    :speakRoomCode="speakRoomCode"
                    :currentDrawer="currentDrawer"
                    :score="playerScore">
                </GuessBoard>
            </div>
        </div>
    </div>

    <!-- Display end screen if game ended -->
    <div v-if="gameEnded && !gameStarted">
        <EndScreen
        @playAgain="playAgain"
        @leaveLobby="leaveLobby"
        :isHost="isHost"
        :playerDataMap=this.mappedPlayerData
        >
        </EndScreen>
    </div>
</template>

<style>
@media (min-width: 1024px) {
    .settings-button {
        margin-right: 40px; /* adjust value as needed */
        border-radius: 50%;
        justify-content: center;
        padding: 5px 5px 5px 5px;
        border-width: 5px;

        position: relative; /* or 'relative' depending on your layout */
        top: 20px;   /* moves it down */
        left: 20px;   /* moves it to the left */

        margin: auto;
    }

    .popup-box {
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #0044ffdd;
        padding: 20px 40px;
        border-radius: 15px;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
        font-size: 4em;
        text-align: center;
        z-index: 1000;
        color: white;
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

    .room-code-block {
        display: flex;
        justify-content: flex-end;  /* Align the box to the right */
        align-items: center;
        background-color: white;
        padding: 15px;  
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        position: fixed;
        right: 20px;  
        bottom: 20px; 
        z-index: 1000; /* Ensure it stays on top of other elements */
        height: auto;
        min-width: 250px; 
        max-width: 350px; 
    }

    .room-code-label {
        font-weight: bold;
        font-size: 1.1rem;
    }

    .room-code-shapes {
        display: flex;
        gap: 0.5rem;
    }

    .room-code-shape {
        width: 60px;
        height: 60px;
        object-fit: contain;
    }

    
    .game {
        min-height: 100vh;
        /* display: flex; */
        align-items: center;
    }

    .top-info{
        margin-right:1000px;
        min-height: 100px; /* Set this to whatever minimum height you need */
    }

    .game-container{
        display: flex;
        flex-direction: row;
        justify-content: space-evenly; /* Space between left and right containers */
        height: 90vh; /* Full height of the viewport */
    }

    .left-container {
        height: 100vh; /* Takes full height of the page */
        /* display: flex; */
        flex-direction: column; /* Stack the boxes vertically */
        justify-content: flex-start;
        gap: 100px;
    }

    .draw-prompt {
        background-color: #ffcc00; /* Light yellow background */
        border-radius: 25px;
        margin: auto;
        display: flex;
        align-items: center;
        padding: 10px;
        font-size: 24px;
        font-weight: bold;
        font-family: 'Segoe UI', sans-serif;
        max-width: fit-content;
        margin-bottom: 20px; /* Space between prompt and drawing area */
        gap: 20px; /* Space between flex items */
    }

    .guess-indicator {
        background-color: #d9aaff; /* Light yellow background */
        border-radius: 25px;
        margin: auto;
        display: flex;
        align-items: center;
        padding: 10px;
        font-size: 24px;
        font-weight: bold;
        font-family: 'Segoe UI', sans-serif;
        max-width: fit-content;
        margin-bottom: 20px; /* Space between prompt and drawing area */
        gap: 20px; /* Space between flex items */
    }

    .prompt-image {
        border-radius: 25px;
        height: auto; 
        width: auto; 
        max-width: 100px; 
        max-height: 100px;
    }

    .drawing-box {
        width: 100%; 
        height: 325px;
        border-radius: 25px;

        /* background-image: url("whiteBoard.jpg"); */
        background-position: center;
        background-size: 100% 100%;

        display: flex;
        align-items: center;
        background-color: transparent; /* Light background for the drawing box */
    }
    
    .drawing-board {
        position: relative;
        bottom: 6px;
        left: 25px;
    }

    .right-container{
        /* background-color: #e0e0e0; */
        height: 100vh;              /* Full height of the page */
        display: flex;
        flex-direction: column;     /* Vertical stacking */
        align-items: center;      /* Align children to the right side*/
        padding: 1rem;              /* Optional padding */
    }

    .quit-btn{
        margin-left: 40px; /* adjust value as needed */
        padding-bottom: 100px;
        padding: 12px 20px;
        font-size: 1.1rem;
        background-color: #1929a0;
        color: white;
        border: none;
        border-radius: 12px;
        text-decoration: none;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(0, 123, 255, 0.2);
        transition: background-color 0.3s, transform 0.1s;
        font-family: 'Segoe UI', sans-serif;
        font-weight: bold;
        height: 25px
    }

    .quit-btn:hover {
        background-color: #111d76;
        transform: scale(1.05);
    }
}
</style>
