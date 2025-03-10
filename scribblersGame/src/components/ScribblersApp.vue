<template>
    <!-- This section is only visible if the user has NOT joined the chat -->
    <div v-if="!joined" class="parent-container">
        <!-- Title for page -->
        <h1 class="title">Scribblers!</h1>
        <p class="choose-avatar">Choose your avatar!</p>
        <div>
            <div class="avatar-container">
                <!-- Buttons to join the chat, calls the 'join' method on click -->
                <button 
                    v-for="(button, index) in landingPageButtons" 
                    :key="index" 
                    v-on:click="join(button)"
                    class="avatar-buttons"
                >
                    <img :src="button.imgSrc" :alt="button.label" class="button-image"/>
                </button>
            </div>
        </div>
    </div> 
    
    <!-- This section is only visible if the user has joined the chat -->
    <div v-if="joined" class="game-container"> 

        <!-- Left side: Drawing canvas and button box -->
        <div class="left-container">
            <div class="drawing-box">
                <h1>Canvas here</h1>
            </div>
            <div class="aac-board-box">
                <h1>AAC Board Here</h1>
                <!-- 
                    Loop through array of buttons and display them
                    Upon click, a message is displayed with the user's avatar and
                    the button label as the message
                -->
                <button 
                    v-for="(button, index) in AACButtons" 
                    :key="index" 
                    v-on:click="sendAACMessage(button.label)"
                    class="aac-buttons"
                >
                    <img :src="button.imgSrc" :alt="button.label" class="button-image"/>
                </button>
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

<script>
// Import the socket.io-client library to enable WebSocket communication
import io from "socket.io-client";

export default {
    data() {
        return {
            joined: false, // Tracks whether the user has joined the chat
            currentUser: "", // Stores the username entered by the user
            currentUserAvatar: "",
            text: "", // Stores the message typed by the user
            messages: [], // Array to store all received messages
            // Buttons for the landing page
            landingPageButtons: [
                {id: 1, imgSrc: 'lion.png', label: 'Lion'},
                {id: 2, imgSrc: 'tiger.webp', label: 'Tiger'},
                {id: 3, imgSrc: 'bear.png', label: 'Bear'}
            ],
            // Buttons for game AAC board
            AACButtons: [
                {id: 1, imgSrc: 'lion.png', label: 'Lion'},
                {id: 2, imgSrc: 'tiger.webp', label: 'Tiger'},
                {id: 3, imgSrc: 'bear.png', label: 'Bear'}
            ],
        };
    },
    methods: {
        // Called when the user clicks the "Join" button
        join(button){
            this.currentUser = button.label; // Assign the user's name based on the button then press
            this.currentUserAvatar = button.imgSrc;
            console.log(this.currentUser); // Logs the username to the console
            this.joined = true; // Updates state to indicate user has joined
            
            // Establish connection to the WebSocket server

            // CHANGE THIS WHEN YOU WANT THE SERVER TO BE PUBLIC

            this.socketInstance = io("http://localhost:3001");
            // this.socketInstance = io("http://[YOUR IP HERE]:3000");

            // Listen for incoming messages from the server and update messages array
            this.socketInstance.on("message:received", (data) => {
                this.messages = this.messages.concat(data);
            });
        },

        // Called when a user clicks on an AAC Button
        sendAACMessage(label){
            this.text = label;
            console.log(this.text); // Logs the message to the console
            this.addMessage(); // Adds the message to the local state
        },
        
        // Adds the user's message to the messages array and sends it to the server
        addMessage(){
            const message = {
                id: new Date().getTime(), // Generates a unique ID based on timestamp
                text: this.text, // Stores the message content
                user: this.currentUser, // Stores the username
                avatar: this.currentUserAvatar,
            };
            
            // Add message to the local messages array
            this.messages = this.messages.concat(message);
            
            // Send the message to the server via WebSocket
            this.socketInstance.emit('message', message);
        },
    },
    name: "ScribblersApp",
};
</script>

<style scoped>
/* Centers the join form in the middle of the screen */
.parent-container {
    display: flex;
    flex-direction: column;
    justify-content: center; /* Centers content vertically */
    align-items: center;     /* Centers content horizontally */
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Perfectly centers the container */
    width: 100%;
    height: 100vh;            /* Takes full viewport height */
}

.title {
    text-align: center;
    margin-bottom: 0px; /* Adds some space between the title and choose string */
    font-size: 50px;
}

.choose-avatar {
    text-align: center;
    margin-bottom: 20px; /* Adds some space between the string and buttons */
    font-size: 30px;
}

.avatar-container {
    display: flex;
    flex-direction: row; /* Stack buttons vertically */
    align-items: center;    /* Center buttons horizontally */
}

.avatar-buttons {
    margin: 10px; /* Adds space between buttons */
    background: none;
    border: none;
    padding: 10px;
    cursor: pointer;
}

.button-image {
    width: 50px; /* Adjust the image size */
    height: 50px;
    object-fit: cover;
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
    height: 95.5%;             /* Takes up the full height of the viewport */
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
</style>
