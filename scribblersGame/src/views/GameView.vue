<script>
/**
 * This file handles the view for all game components. 
 * Host and Join Lobby point to this file.
 * WaitingRoom, AACboard, DrawingBoard, and GuessBoard are children of this component.
 */
import io from "socket.io-client"; // Import the socket.io-client library to enable WebSocket communication
import AacBoard from '../components/aacBoard.vue'; //import AACBoard component
import DrawingBoard from '../components/DrawingBoard.vue'; // import Drawing board component
import WaitingRoom from '../components/WaitingRoom.vue'; // import Drawing board component
import GuessBoard from "@/components/GuessBoard.vue";
import EndScreen from "@/components/EndGameScreen.vue"
import { GameState } from '@/stores/GameState';
import { SettingState } from '@/stores/SettingState'

const inProduction = false; //change this variable to switch between connecting to public backend server and localhost
const socketServer =  "scribblersserver.fly.dev"; //web address for hosted websocket server
const testServer = "192.168.1.167" //set to IP address of test server

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
        
        let currentUserMessage = { // Holds all the user message info being sent back and forth between client and server
            id: 0,
            avatar: GameState().currentUserAvatar,
            user: GameState().currentUser,
            text: "",
            imagePath: ""
        };

        return {
            showTimeRanOutPopup: false, //determines if this popup will be shown
            showAllGuessedCorrectPopup: false, //determines if this popup will be shown
            playerScore: 0, // Store the current score of the player
            settingsState: null, // Intialize a variable for the settings
            selectedImagePath: "", //path to current AAC image selected
            currentUser: GameState().currentUser,
            currentUserAvatar: GameState().currentUserAvatar,
            currentUserMessage,
            currentDrawer: "",
            isGuessCorrect: false, //tracks if current user has guessed correctly
            messageBoard: [
                currentUserMessage
            ], // Array to store all received users in message board
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

        // Connect to the server
        serverConnect(){

            // Establish connection to the WebSocket server
            if (inProduction) 
                this.socketInstance = io(socketServer);
            else 
                this.socketInstance = io("http://" + testServer + ":3001"); // CHANGE THIS WHEN YOU WANT THE SERVER TO BE PUBLIC
            
            //  Create new lobby if host is connecting to socket, otherwise attempt to join specified lobby
            if (GameState().isHost) {
                
                //  Create new lobby, if host is not playing send null for user to add to player data
                if (GameState().isHostPlaying) {
                    this.players.push(GameState().currentUser)
                    this.mappedPlayerData.set(GameState().currentUser, {
                        currentGuess: "",
                        currentGuessImagePath: "",
                        score: 0
                    })
                    this.socketInstance.emit("create-new-lobby", this.numRounds, this.maxPlayers, this.players, this.currentUser);
                }
                else
                    this.socketInstance.emit("create-new-lobby", this.numRounds, this.maxPlayers, this.players, null);
            }
            else {
                this.socketInstance.emit('join-room', this.roomCodeStr, GameState().currentUser, this.isHost);    
            }

            // Listen for new drawer
            this.socketInstance.on("update-drawer", (drawer) => {
                this.currentDrawer = drawer; // Add this line to store the current drawer
                
                if (GameState().currentUser == drawer)
                    this.isDrawer = true;
                else
                    this.isDrawer = false;   
            })
        
            // Listen for new lobby code
            this.socketInstance.on("update-lobby-code", (newRoomCode) => {
                
                //console.log("Updating lobby code: ", newRoomCode);
                this.roomCodeStr = newRoomCode;

                // Fix: Convert string digits to numbers properly
                this.roomCodeArr = newRoomCode.split('').map(digit => parseInt(digit, 10));

                // Connect user to lobby
                this.socketInstance.emit('join-room', this.roomCodeStr, GameState().currentUser, this.isHost);
            });

            // Listen for player leaving
            this.socketInstance.on("remove-player", (user) => {

                this.mappedPlayerData.delete(user)
                console.log(this.mappedPlayerData)
            })

            // Listen for player joining
            this.socketInstance.on("add-player", (user, value) => {

                this.mappedPlayerData.set(user, value)
                console.log(this.mappedPlayerData)
            })

            // Listen for new player list
            this.socketInstance.on("update-player-list", (newPlayers) => {

                this.players = newPlayers;
            })

            //  Listen for max players for lobby
            this.socketInstance.on("update-max-players", (updateMaxPlayers) => {

                this.maxPlayers = updateMaxPlayers;
            })

            //  Listen for new round count
            this.socketInstance.on("update-round", (updateRound) => {

                this.currentRound = updateRound;
                console.log(`currentRound: ${this.currentRound}`)
            })

            //  Listen for number of rounds
            this.socketInstance.on("update-num-rounds", (updateNumRounds) => {

                this.numRounds = updateNumRounds;
                console.log(`currentRound: ${this.numRounds}`)
            })

            //  Listen for new drawer
            this.socketInstance.on("update-drawer", (drawer) => {

                if (GameState().currentUser == drawer)
                    this.isDrawer = true;
                else
                    this.isDrawer = false;   
            })

            //  Listen for "everyone guessed correct"
            this.socketInstance.on("all-guessed-correct", (message) => {
                this.triggerAllGuessedCorrectPopup();
            })

            //  Listen for "timer ran out"
            this.socketInstance.on("timer-ran-out", (message) => {
                this.triggerTimeRanOutPopup();
            })

            //  Listen for update to current user
            this.socketInstance.on("update-user", (user) => {

                GameState().currentUser = user;
            })

            //  Listen for new prompt
            this.socketInstance.on("update-prompt", (updatePrompt, path) => {

                this.promptWord = updatePrompt.word;
                console.log('PROMPT WORD: ', this.promptWord);
                this.promptImgPath = path;
                this.isGuessCorrect = false;
            })

            //  Listen for new guesses
            this.socketInstance.on("update-user-guess", ({
                user,
                guess,
                imagePath,
                score
                }) => {

                this.mappedPlayerData.get(user).currentGuess = guess;
                this.mappedPlayerData.get(user).currentGuessImagePath = imagePath;
                this.mappedPlayerData.get(user).score = score;
                console.log('data ' + user + ' ' + guess + ' ' + imagePath + ' ' + score)

                // If the guess is correct, display it
                if (guess == this.promptWord && guess){
                    //console.log(`${this.promptWord} is the prompt and ${guess} is the guess.`)
                    console.log(`${user} guessed correctly!`)
                } 
            })

            //  Listen for host to start of new round
            this.socketInstance.on("start-game", () => {

                this.gameStarted = true;
                this.gameEnded = false;
            })

            //  Listen for end of game
            this.socketInstance.on("end-game", () => {

                this.gameStarted = false;
                this.gameEnded = true;
                this.currentRound = 0;
            })

            //  Listen for host to play game again
            this.socketInstance.on("play-again", () => {
                console.log(' ON PLAY AGAIN ')

                this.gameStarted = false;
                this.gameEnded = false;
            })

            // Listen for the player count from the server
            this.socketInstance.on("player-count-update", (count) => {
                this.playerCount = count;
                //console.log("Updated player count:", count);
            });

            // Listen for "message" array update and update the message
            this.socketInstance.on('update-user-message-board', (data) => {
                for(let i=0; i<data.length; i++){
                    console.log("user: " + data[i].user);
                }
                // Re-assign the message board
                this.messageBoard = data;
            });

            // NOT BEING USED
            // Listen for incoming messages from the server and update messages array
            this.socketInstance.on("message:received", (data) => {
                this.messageBoard = this.messageBoard.concat(data); // Append received message to messages array
            });
            
            // Listen for broadcasted initial drawing data
            this.socketInstance.on("cast-draw-init", (x, y, draw_color, draw_width) => {
                this.context = document.getElementById("canvas").getContext("2d");
                this.context.strokeStyle = draw_color;
                this.context.lineWidth = draw_width;
                this.context.beginPath();
                this.context.moveTo(x, y);
            });

            // Listen for broadcasted drawing data
            this.socketInstance.on("cast-draw", (x, y) => {
                this.context.lineTo(x, y);
                this.context.stroke();
            });

            // Listen for broadcasted final drawing data
            this.socketInstance.on("cast-draw-end", () => {
                this.context.closePath();
            });

            // Listen for broadcasted clear canvas
            this.socketInstance.on("cast-draw-clear", () => {
                this.context = document.getElementById("canvas").getContext("2d");
                this.context.fillStyle = "white";
                this.context.clearRect(0, 0, document.getElementById("canvas").width, document.getElementById("canvas").height);
            });

            // Listen for broadcasted undo canvas
            this.socketInstance.on("cast-draw-undo", (previousState) => {
                this.context.putImageData(previousState, 0, 0);
            });

            // Listen for broadcasted timer update from server
            this.socketInstance.on("timer-update", (serverTime) => {
                this.roundTimer = serverTime;
            });
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
                this.currentUserMessage.text = item; //stores aac button selected by user
                this.currentUserMessage.imagePath = imagePath;
                this.mappedPlayerData.get(this.currentUser).currentGuess = item;
                this.mappedPlayerData.get(this.currentUser).currentGuessImagePath = imagePath;

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
                    this.mappedPlayerData.get(this.currentUser).score = this.playerScore

                    console.log(`You guessed correctly!`)
                    this.mappedPlayerData.get(this.currentUser).currentGuess = "Correct!";
                    this.mappedPlayerData.get(this.currentUser).currentGuessImagePath = '\correct.png';
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
                    this.currentUser, 
                    this.mappedPlayerData.get(this.currentUser).currentGuess,
                    this.mappedPlayerData.get(this.currentUser).currentGuessImagePath,
                    this.mappedPlayerData.get(this.currentUser).score
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
            console.log(' EMIT PLAY AGAIN ')
            this.socketInstance.emit("play-again", this.roomCodeStr);
        },

        //  Handles request to leave lobby
        leaveLobby() {
            this.socketInstance.emit("leave-room", this.roomCodeStr, GameState().currentUser);
        },
    },
    // Automatically connect to the WebSocket server when the component is mounted
    mounted(){
        this.serverConnect();
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
            <!--  Remove after testing timer
            <h2 @click="speakNow(roundTimer + 'seconds left')">Timer: {{ roundTimer }}</h2>
            -->
                <!-- Assign the messageBoard in this class to the messageBoard in the MessageBoard component -->
                <GuessBoard 
                    :guesses=this.messageBoard
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
