const exp = require('constants'); // Importing constants module (not needed in this case)
const express = require('express'); // Importing Express.js to create the server
const http = require('http'); // Importing HTTP module to create an HTTP server
const { Server } = require('socket.io'); // Importing the Server class from socket.io

const app = express(); // Initializing an Express application
const server = http.createServer(app); // Creating an HTTP server using Express

// Initializing a new Socket.io server instance and configuring CORS
const io = new Server(server, {
    cors: {
        origin: "*", // Allows connections from any origin (use restrictive policies in production)
        methods: ['GET', "POST"] // Specifies allowed HTTP methods
    }
});

let currentDrawer = null; //keeps track of current drawer (by socket ID)

//drawing prompt word list
const wordsList = [
    'eat', 'jump', 'run', 'sleep', 'bird', 'cat', 'dog', 'elephant', 
    'horse', 'mouse', 'glasses', 'glove', 'hat', 'pants', 'shirt', 
    'shoe', 'apple', 'banana', 'carrot', 'grapes', 'pizza', 'spaghetti'
];

// Function to select a random word from the list
function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordsList.length);
    return wordsList[randomIndex];
}

// Event listener for new socket connections
io.on('connection', (socket) => {
    console.log(`User ${socket.id} is connected`); // Logs when a new user connects

    //assign drawer if there isn't one
    if (!currentDrawer){
        currentDrawer = socket.id; //makes this user the drawer
        const wordForDrawer = getRandomWord(); // Get a random word for the drawer

        // Send "you-are-drawer" and  randomly selected word to the new drawer
        socket.emit('you-are-drawer', { word: wordForDrawer });

        console.log(`User ${socket.id} is the drawer with word: ${wordForDrawer}`);

    }

    // Listener for 'message' events from the client
    socket.on('message', (data) => {
        console.log('message received:', data); 
        socket.broadcast.emit('message:received', data); // Broadcasts received messages to all other clients
    });

    // Listener for socket disconnection
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`); // Logs when a user disconnects

        //TODO: at some point, handle drawer leaving here?
    });
});

// Start the server and listen on port 3000
server.listen(3001, () => {
    console.log("Scribblers server is running on port 3001");
});
