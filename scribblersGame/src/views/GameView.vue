<script>
import io from "socket.io-client"; // Import the socket.io-client library to enable WebSocket communication
import AacBoard from '../components/aacBoard.vue'; //import AACBoard component
import DrawingBoard from '../components/DrawingBoard.vue'; // import Drawing board component

export default {
    components: {
        AacBoard, //register Aac board as a component
        DrawingBoard, //register drawing board as a component
    },
    data() {
        const user = this.$route.query.user || ""; // Stores the username entered by the user
        const avatar = this.$route.query.avatar || ""; // Stores the username entered by the user

        let currentUserMessage = { // Holds all the user message info being sent back and forth between client and server
            id: 0,
            avatar: avatar,
            user: user,
            text: "",
            imagePath: ""
        };

        return {
            selectedImagePath: "", //path to current AAC image selected
            currentUserMessage,
            messageBoard: [
                currentUserMessage
            ], // Array to store all received users in message board
            isDrawer: false, //track if user is the drawer
            promptWord: "", //store the random drawing prompt word
            promptImgPath: "", // store the path to the image to be referenced for prompt
            context: CanvasRenderingContext2D, // stores drawing context for drawing broadcasted data
            roundLength: 10, // how many seconds each round will last
            roundTimer: 0,  // tracks counter state
            roomCodeArr: this.$route.query.roomCode, // stores room code for game as array of numbers
            roomCodeStr: this.$route.query.roomCode.join(''), // stores room code for game as string of numbers
            AACButtons: [// Buttons for game AAC board with associated images and labels
                {id: 1, imgSrc: 'lion.png', label: 'Lion'},
                {id: 2, imgSrc: 'tiger.webp', label: 'Tiger'},
                {id: 3, imgSrc: 'bear.png', label: 'Bear'}
            ],
        };
    },
    methods: {
        // Connect to the server
        serverConnect(){
            // Establish connection to the WebSocket server
            this.socketInstance = io("http://localhost:3001"); // CHANGE THIS WHEN YOU WANT THE SERVER TO BE PUBLIC
            // this.socketInstance = io("http://[YOUR IP HERE]:3000");

            // 
            this.socketInstance.emit('join-room', this.roomCodeStr);

            // Listen for the player count from the server
            this.socketInstance.on("player-count-update", (count) => {
                this.playerCount = count;
                console.log("Updated player count:", count);
            });

            // Signal backend to add user to the message board
            this.socketInstance.emit('message', this.currentUserMessage, this.roomCodeStr);

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

            //Listen for 'you-are-drawer' message and random prompt word
            this.socketInstance.on("you-are-drawer", (data) => {
                console.log('you are the drawer now');
                this.isDrawer = true;
                this.promptWord = data.word;
                console.log(this.promptWord);
                this.promptImgPath = data.path;
            });

            //Listen for 'you-are-guesser' message when drawing is done
            this.socketInstance.on('you-are-guesser', (data) => {
                console.log('you are a guesser now');
                this.isDrawer = false;
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
                /*
                if (serverTime == 0){
                    HANDLE END OF ROUND LOGIC HERE
                }
                */
            });
        },
      
        // NOT BEING USED
        // Adds the user's message to the messages array and sends it to the server
        addMessage(){
          const message = {
              id: new Date().getTime(), // Generates a unique ID based on timestamp
              text: this.text, // Stores the message content
              user: this.currentUser, // Stores the username
              avatar: this.currentUserAvatar, // Stores the avatar URL
              imagePath: this.selectedImagePath //Stores AAC image path
          };
          
          // Add message to the local messages array
          this.messageBoard = this.messageBoard.concat(message);
          
          // Send the message to the server via WebSocket
          this.socketInstance.emit('message', message, this.roomCodeStr);
        },

        // Disconnects the user when called
        serverDisconnect(){
            try {
                this.playerCount = 0;

                // Check if socket exists and is connected
                if (this.socketInstance && this.socketInstance.connected) {
                    // disconnect from server
                    this.socketInstance.disconnect(); // works like how "this.socketInstance.emit('disconnect')" should work
                    console.log("Disconnected from server.");
                } else {
                    console.warn("Socket is not connected or already null.");
                }
            } catch (error) {
                console.error("Error during disconnection:", error.message || error);
            }
        },
        
        //Function that handles a word selection on the AAC board 
        handleItemSelected({item, imagePath}) {
            console.log('Item selected:', item); //logs selected item
            this.currentUserMessage.text = item; //stores aac button selected by user
            this.currentUserMessage.imagePath = imagePath;
            // this.addMessage(); //sends websocket message
            this.socketInstance.emit('message', this.currentUserMessage, this.roomCodeStr); // Change the current user's message and img path
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
            this.socketInstance.emit('draw-clear', this.roomCodeStr);
        },

        //  Handles sending request to clear undo canvas
        sendDrawDataUndo() {
            this.socketInstance.emit('draw-undo', this.roomCodeStr);
        },

        //  Send request to start server timer
        sendTimerStart(length){
            if (this.roundTimer != 0) return;
            this.socketInstance.emit('timer-start', this.roomCodeStr, length);
        }
    },
    // Automatically connect to the WebSocket server when the component is mounted
    mounted(){
        this.serverConnect();
    },
    name: "GameView",
};
</script>

<template>
    <div class="game-container"> 
        <!-- Left side: Drawing canvas and button box -->
        <div class="left-container">
            <RouterLink 
            :to="{
                path: '/', // Navigates to the home route
            }"
            @click="serverDisconnect"
            class="quit-btn">
            QUIT ❌</RouterLink>
            <!--Display drawing prompt for drawer-->
            <div v-if="isDrawer" class="draw-prompt">
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
                    @canvasUndo="sendDrawDataUndo">
                </DrawingBoard>
            </div>

            <div class="aac-board-box">
                <!-- AacBoard component is rendered here and we catch item selections here.-->
                <AacBoard @itemSelected="handleItemSelected"/>
            </div>
        </div>

        <div class="right-container">
            <!--  Remove after testing timer -->
            <h2>Timer: {{ roundTimer }}</h2>
            <button type="test" class="test" @click="sendTimerStart(roundLength)">test</button>
                
            <div class="chat-container">                
                <!-- Loop through messageBoard array and display each message -->
                <div v-for="message in messageBoard" :key="message.id" class="chat-message">
                    <img :src="message.avatar" :alt="message.user" class="game-avatar-image" />
                    <span class="guess-message">{{ message.text }}</span>
                    <img 
                        v-if="message.imagePath" 
                        :src="message.imagePath" 
                        alt="Symbol" 
                        class="message-symbol" 
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@media (min-width: 1024px) {
    .game {
        min-height: 100vh;
        /* display: flex; */
        align-items: center;
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
        height: 60vh;
        border-radius: 25px;

        background-image: url("whiteBoard.jpg");
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

    .aac-board-box {
        width: 100%;
        height: 25%; /* Takes 20% of the page height */
        border: 5px solid blue; /* Border for the button area */
        background-color: #e0e0e0; /* Light background for the button box */
    }

    .aac-buttons{
        margin: 10px; /* Adds space between buttons */
        background: white;
        border: 1px bold black;
        padding: 10px;
        cursor: pointer;
    }

    .right-container{
        /* background-color: #e0e0e0; */
        height: 100vh;              /* Full height of the page */
        display: flex;
        flex-direction: column;     /* Vertical stacking */
        align-items: center;      /*cAlign children to the right side*/
        padding: 1rem;              /* Optional padding */
    }

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

    .chat-message {
        display: flex;
        flex-direction: row;
    }

    .game-avatar-image {
        width: auto; /* Adjust the image size */
        height: 50px;
        padding-left: 1rem;
    }

    .guess-message {
        padding-top: 0.9rem;
        font-weight: bold;
        font-family: 'Segoe UI', sans-serif;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }

    .message-symbol {
        width: 50px;
        height: 50px;
        margin-left: auto;
        padding-right: 1rem;
    }

    .quit-btn{
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
    }

    .quit-btn:hover {
        background-color: #111d76;
        transform: translateY(-2px);
    }
}
</style>
