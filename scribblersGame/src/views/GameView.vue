<script>
// Import the socket.io-client library to enable WebSocket communication
import io from "socket.io-client";
import AacBoard from '../components/aacBoard.vue'; //import AACBoard component
import DrawingBoard from '../components/DrawingBoard.vue'; // import Drawing board component

export default {
    components: {
        AacBoard, //register Aac board as a component
        DrawingBoard, //register drawing board as a component
    },
    data() {
        return {
            currentUser: this.$route.query.user || "", // Stores the username entered by the user
            currentUserAvatar:  this.$route.query.avatar || "", // Stores the username entered by the user
            text: "", // Stores the message typed by the user
            messages: [], // Array to store all received messages
            isDrawer: false, //track if user is the drawer
            promptWord: "", //store the random drawing prompt word
            // Buttons for game AAC board with associated images and labels
            AACButtons: [
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

            // Listen for incoming messages from the server and update messages array
            this.socketInstance.on("message:received", (data) => {
                this.messages = this.messages.concat(data); // Append received message to messages array
            });

            //Listen for 'you-are-drawer' message and random prompt word
            this.socketInstance.on("you-are-drawer", (data) => {
                console.log('you are the drawer now');
                console.log(this.socketInstance.connected);
                console.log(this.socketInstance);
                this.isDrawer = true;
                this.promptWord = data.word;
            });

            // Listen for broadcasted initial drawing data
            this.socketInstance.on("cast-draw-init", (x, y, draw_color, draw_width) => {
                console.log("Received initial drawing data", x, y, draw_color, draw_width);
            });

            // Listen for broadcasted drawing data
            this.socketInstance.on("cast-draw", (x, y) => {
                console.log("Received drawing data", x, y);
            });

            // Listen for broadcasted final drawing data
            this.socketInstance.on("cast-draw-end", () => {
                console.log("Received final drawing data");
            });
        },
      
        // Adds the user's message to the messages array and sends it to the server
        addMessage(){
          const message = {
              id: new Date().getTime(), // Generates a unique ID based on timestamp
              text: this.text, // Stores the message content
              user: this.currentUser, // Stores the username
              avatar: this.currentUserAvatar, // Stores the avatar URL
          };
          
          // Add message to the local messages array
          this.messages = this.messages.concat(message);
          
          // Send the message to the server via WebSocket
          this.socketInstance.emit('message', message);
        },
        

        //Function that handles a word selection on the AAC board 
        handleItemSelected(item) {
            console.log('Item selected:', item); //logs selected item
            this.text = item; //stores aac button selected by user
            this.addMessage(); //sends websocket message
        },

        //  Handles sending initial drawing data to observer canvases (on mouse click)
        sendDrawDataInit(x, y, draw_color, draw_width) {
            this.socketInstance.emit('draw-init', x, y, draw_color, draw_width);
        },

        //  Handles sending drawing data to observer canvases (on mouse move)
        sendDrawData(x, y) {
            this.socketInstance.emit('draw', x, y);
        },

        //  Handles sending final drawing data to observer canvases (on mouse up)
        sendDrawDataEnd() {
            this.socketInstance.emit('draw-end');
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
            <!--Display drawing prompt for drawer-->
            <div v-if="isDrawer" class="draw-prompt">
                <h2>DRAW: {{ promptWord }}</h2>
            </div>

            <div class="drawing-box">
                <!-- <h1>Drawing board here</h1> -->
                <!-- handles emit statements in DrawingBoard.vue -->
                <DrawingBoard 
                    @startDrawData="sendDrawDataInit" 
                    @addDrawData="sendDrawData" 
                    @endDrawData="sendDrawDataEnd">
                </DrawingBoard>
            </div>

            <div class="aac-board-box">
                <!-- AacBoard component is rendered here and we catch item selections here.-->
                <AacBoard @itemSelected="handleItemSelected"/>
            </div>
        </div>

        <div class="right-container">
            <div class="chat-container">
                <!-- Loop through messages array and display each message -->
                <div v-for="message in messages" :key="message.id">
                    <img :src="message.avatar" :alt="message.user" class="game-avatar-image"/>
                    {{ message.text }}
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
      width: 80%; /* Takes 80% of the page width */
      height: 100vh; /* Takes full height of the page */
      display: flex;
      flex-direction: column; /* Stack the boxes vertically */
      justify-content: flex-start;
  }

  .draw-prompt {
    background-color: #ffcc00; /* Light yellow background */
      padding: 10px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px; /* Space between prompt and drawing area */
  }

  .drawing-box {
      width: 100%;
      height: 65%; /* Takes 60% of the page height */
      border: 5px solid brown; /* Border for the drawing area */
      background-color: #f0f0f0; /* Light background for the drawing box */
      margin-bottom: 20px; /* Space between the drawing box and the button box */
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
      height: 100vh; /* Takes full height of the page */
      display: flex;
      justify-content: flex-end; /* Aligns the chat to the right */
  }

  .chat-container {            
      height: 94.5%;             /* Takes up the full height of the viewport */
      position: relative;        /* Ensures the text input stays at the bottom */
      overflow-y: auto;          /* Enables scrolling if messages exceed height */
      background-color: #c9c6c6; /* Optional background color */
      box-sizing: border-box;    /* Ensures padding is included in width/height */
      border: 5px solid black;
      resize: none;
      width: 150px;
  }

  .game-avatar-image {
      width: 30px; /* Adjust the image size */
      height: 30px;
  }
  
}
</style>
