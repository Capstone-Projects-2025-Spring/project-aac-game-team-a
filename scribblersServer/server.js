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

let currentDrawerID = null; //keeps track of current drawer (by socket ID)
let currentDrawerIndex = 0; //index in queue of current drawer
let currentPrompt = null; //keeps track of current prompt
let playerCount = 0; //number of player that have joined
let correctGuesses = 0; //tracks how many have guessed correctly in a round
let playersQueue = []; //queue of players by socket ID
const maxCycles = 2; //number of cycles (how many times each player draws)
let currentCycle = 0; //tracks cycle number

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
    playerCount++;

    //add player to the queue
    playersQueue.push(socket.id);

    //assign drawer if there isn't one
    if (!currentDrawerID){
        currentDrawerID = socket.id; //makes this user the drawer
        currentPrompt = getRandomWord(); // Get a random word for the drawer

        // Send "you-are-drawer" and  randomly selected word to the new drawer
        socket.emit('you-are-drawer', { word: currentPrompt });
        console.log(`User ${socket.id} is the drawer with word: ${currentPrompt}`);

    }

    if(currentDrawerIndex === 0) {
        currentPrompt = getRandomWord();
        socket.to(playersQueue[currentDrawerIndex]).emit('you-are-drawer', {word: currentPrompt});
        console.log(`User ${socket.id} is the drawer with word: ${currentPrompt}`);
    }

    socket.on("draw_data", (data) => {
        console.log("draw_data log")
        try {
            console.log(data)
            socket.broadcast.emit('draw_data:received', data)
    
        } catch (err){
            console.log("Message data unable to be updated");
            console.error(err)
        }
    });

    // Listener for 'message' events from the client
    socket.on('message', (data) => {
        console.log('message received:', data); 

        //process guesses made by non drawing players
        if(socket.id !== currentDrawerID) {
            if (data.text.toLowerCase() === currentPrompt.toLowerCase()) {
                console.log(`Player ${socket.id} guessed correctly!`);

                /*
                socket.emit('correct-guess', {
                    user: data.user
                }); */
                data.text = 'Guessed Correctly!';

                
                socket.emit('message:received', data); // Broadcasts received messages to all other clients, including player who guesesd correct
                correctGuesses++;

                //check if all guessers ahve guessed correctly
                if (correctGuesses === playerCount - 1) {
                    correctGuesses = 0;

                    //next drawer
                    currentDrawerIndex = (currentDrawerIndex + 1) % playersQueue.length;
                    currentPrompt = getRandomWord();
                }

                //check if max cycles have been reached
                if (currentCycle < maxCycles) {
                    currentCycle++;
                    socket.to(playersQueue[currentDrawerIndex]).emit('you-are-drawer', {word: currentPrompt});
                    console.log(`User ${playersQueue[currentDrawerIndex]} is the drawer with word: ${currentPrompt}`);
                } else {
                    console.log("End of game.");
                    //TODO: End of game ***
                }

            }
            socket.broadcast.emit('message:received', data); // Broadcasts received messages to all other clients
        }
    });
    
    //  Listeners for handling drawing data
    socket.on("draw-init", (x, y, draw_color, draw_width, context) => {
        socket.broadcast.emit("cast-draw-init", x, y, draw_color, draw_width, context);
    });

    socket.on("draw", (x, y) => {
        socket.broadcast.emit("cast-draw", x, y);
    });

    socket.on("draw-end", () => {
        socket.broadcast.emit("cast-draw-end");
    });

    socket.on("draw-clear", () => {
        socket.broadcast.emit("cast-draw-clear");
    });

    socket.on("draw-undo", () => {
        socket.broadcast.emit("cast-draw-undo", previousState);
    });
    
    // Listener for socket disconnection
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`); // Logs when a user disconnects

        //TODO: at some point, handle people disconnecting
    });
});

// Start the server and listen on port 3000
server.listen(3001, () => {
    console.log("Scribblers server is running on port 3001");
});
