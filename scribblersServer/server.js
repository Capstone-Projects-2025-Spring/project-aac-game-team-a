const exp = require('constants'); // (Unused) Imports constants module, can be removed

const express = require('express'); // Imports Express.js to set up a web server
const http = require('http'); // Imports Node's HTTP module to create the server
const { Server } = require('socket.io'); // Imports Server class from socket.io for WebSocket functionality

const app = express(); // Initializes an Express application
const server = http.createServer(app); // Creates an HTTP server using the Express app

const GameSessionClass = require("./objects/GameSessionClass"); // Custom class to represent a game session
const SocketHandlerClass = require("./objects/SocketHandler"); // Custom class to handle socket events
const GameSessionsDBClass = require("./Database/GameSessions.js"); // Class to handle in-memory game session DB

// Set up the WebSocket server with CORS settings
const io = new Server(server, {
    cors: {
        origin: "*", // Allows all origins to connect (should be restricted in production)
        methods: ['GET', "POST"] // Allowed HTTP methods
    }
});

// Game state variables
let currentDrawerID = null; // ID of the current drawer
let currentDrawerIndex = 0; // Index in playersQueue of the current drawer
let playerCount = 0; // Tracks number of players connected
let correctGuesses = 0; // Tracks how many players guessed correctly in current round
let playersQueue = []; // Queue of player socket IDs for assigning drawer turns
const maxCycles = 10; // Max number of drawing cycles for the game
let currentCycle = 0; // Tracks current drawing cycle
let imagesPerPrompt = 3; // Number of available images per prompt
let currentPromptObject = null; // Holds the current drawing prompt object
let messageBoard = []; // Holds the messages 

const activeTimers = new Map(); // Stores timers for each room
const GameSessionDB = new GameSessionsDBClass(); // Initializes in-memory database for game sessions

// Drawing prompt objects categorized by type
const promptList = [
    {word: 'Eat', type: 'Actions'},
    {word: 'Jump', type: 'Actions'},
    {word: 'Run', type: 'Actions'},
    {word: 'Sleep', type: 'Actions'},
    {word: 'Bird', type: 'Animals'},
    {word: 'Cat', type: 'Animals'},
    {word: 'Dog', type: 'Animals'},
    {word: 'Elephant', type: 'Animals'},
    {word: 'Horse', type: 'Animals'},
    {word: 'Mouse', type: 'Animals'},
    {word: 'Glasses', type: 'Clothing'},
    {word: 'Gloves', type: 'Clothing'},
    {word: 'Hat', type: 'Clothing'},
    {word: 'Pants', type: 'Clothing'},
    {word: 'Shirt', type: 'Clothing'},
    {word: 'Shoe', type: 'Clothing'},
    {word: 'Apple', type: 'Food'},
    {word: 'Banana', type: 'Food'},
    {word: 'Carrot', type: 'Food'},
    {word: 'Grapes', type: 'Food'},
    {word: 'Pizza', type: 'Food'},
    {word: 'Spaghetti', type: 'Food'}
];

// Selects a random prompt object
function getPromptObject() {
    const randomIndex = Math.floor(Math.random() * promptList.length);
    return promptList[randomIndex];
}

// Constructs the file path to an image for a given prompt
function getPath(promptObject){
    let randomImgNumber = Math.floor(Math.random() * imagesPerPrompt) + 1;
    let lowerCaseWord = randomImgNumber + promptObject.word.toLowerCase();
    let path = 'promptImages/' + promptObject.type + '/' + promptObject.word + '/' + lowerCaseWord + '.png';
    // console.log(path); // Logs path for testing
    return path;
}

// Main WebSocket connection handler
io.on('connection', (socket) => {
    // Handle when a user joins a specific game room
    socket.on('join-room', (code)  => {
        socket.join(code); // Adds this socket to the given room
        console.log(`User ${socket.id} is connected to room ${code}`);
    });

    playerCount++; // Increment total player count
    playersQueue.push(socket.id); // Add new player to queue
    io.emit("player-count-update", { playerCount }); // Notify all players of new count

    // Add players to the message board
    socket.on('add-user-to-message-board', (data) => {
        let userMessage = {
            user: data.user, 
            avatar: data.avatar,
            text: data.text
        }
        messageBoard.push(userMessage);
    })
    
    // send the new updated board
    io.emit('update-user-message-board', (messageBoard));

    /*
    //assign drawer if there isn't one
    if (!currentDrawerID){
        currentDrawerID = socket.id; //makes this user the drawer
        currentPromptObject.word = getPromptObject(); // Get a random word for the drawer

        // Send "you-are-drawer" and  randomly selected word to the new drawer
        socket.emit('you-are-drawer', { word: currentPromptObject.word });
        console.log(`FIRST DRAWER: User ${socket.id} is the drawer with word: ${currentPromptObject.word}`);

    }*/

    // Initialize the socket handler which manages game session behavior
    const SocketHandler = new SocketHandlerClass(io, socket, GameSessionDB);
    SocketHandler.createGame();
    SocketHandler.onPlayerJoin();
    SocketHandler.onRoundStart();

    // If this is the first player to join, assign them as the drawer
    if(currentDrawerIndex === 0 && !currentDrawerID) {
        // Generate a 4-digit game code (currently unused)
        const randomNumbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9));
        const randomInteger = parseInt(randomNumbers.join(""), 10);
        console.log(randomInteger);

        // // grab number of players
        // let numbPlayers = 4
        // // grab number of rounds
        // let numbRounds = 3
        // // grab the a player
        // currentDrawerID = socket.id; //assigns first user to join's ID to currentDrawerID
        // // Generating game session data
        // let gameSessionData = new GameSessionClass(randomInteger,[currentDrawerID], numbRounds, numbPlayers, null)
        // gamesessions[gameSessionData.sessionID] = gameSessionData


        // Choose a prompt and send it to the drawer
        currentPromptObject = getPromptObject();
        let currentPromptImgPath = getPath(currentPromptObject);

        io.to(playersQueue[currentDrawerIndex]).emit('you-are-drawer', {
            word: currentPromptObject.word,
            path: currentPromptImgPath
        });

        // console.log(`(1)User ${socket.id} is the drawer with word: ${currentPromptObject.word} with path ${currentPromptImgPath}`);
        // console.log("games session data: " + gamesessions[gameSessionData.sessionID].toString())

    }

    // Handle incoming drawing data and broadcast to others
    socket.on("draw_data", (data) => {
        try {
            console.log(data);
            socket.broadcast.emit('draw_data:received', data); // Sends drawing data to all other users
        } catch (err){
            console.log("Message data unable to be updated");
            console.error(err);
        }
    });

    // Handles guess messages from players
    socket.on('message', (data, room) => {
        if(socket.id !== currentDrawerID) { // Only guessers can guess
            if (data.text.toLowerCase() === currentPromptObject.word.toLowerCase()) {
                console.log(`Player ${socket.id} guessed correctly!`);
                data.text = 'Guessed Correctly!';
                io.in(room).emit('message:received', data);
                correctGuesses++;

                // All players guessed correctly, move to next round
                if (correctGuesses === playerCount - 1) {
                    correctGuesses = 0;
                    currentDrawerIndex = (currentDrawerIndex + 1) % playersQueue.length;
                    currentPromptObject.word = getPromptObject();

                    const previousDrawerIndex = (currentDrawerIndex - 1 + playersQueue.length) % playersQueue.length;
                    io.to(playersQueue[previousDrawerIndex]).emit('you-are-guesser');
                }

                // If game still ongoing, assign next drawer
                if (currentCycle < maxCycles) {
                    currentCycle++;
                    io.to(playersQueue[currentDrawerIndex]).emit('you-are-drawer', {word: currentPromptObject.word});
                    currentDrawerID = playersQueue[currentDrawerIndex];
                } else {
                    console.log("End of game.");
                    // TODO: End of game logic
                }
            }
            socket.to(room).emit('message:received', data);
        }
    });

    // Relay canvas drawing events to others in the room
    socket.on("draw-init", (room, x, y, draw_color, draw_width, context) => {
        socket.to(room).emit("cast-draw-init", x, y, draw_color, draw_width, context);
    });

    socket.on("draw", (room, x, y) => {
        socket.to(room).emit("cast-draw", x, y);
    });

    socket.on("draw-end", (room) => {
        socket.to(room).emit("cast-draw-end");
    });

    socket.on("draw-clear", (room) => {
        socket.to(room).emit("cast-draw-clear");
    });

    socket.on("draw-undo", (room) => {
        socket.to(room).emit("cast-draw-undo");
    });

    // Start a countdown timer for the game round
    socket.on("timer-start", (room, length) => {
        const gameTimer = {
            timerID: setInterval(updateTimer, 1000, room), // Call every 1 sec
            timerValue: length // Initial countdown time
        };
        activeTimers.set(room, gameTimer); // Store timer reference
    });

    // Broadcast timer updates and handle expiration
    function updateTimer(room){
        io.in(room).emit("timer-update", activeTimers.get(room).timerValue);

        if (activeTimers.get(room).timerValue == 0) {
            clearInterval(activeTimers.get(room).timerID); // Stop timer
            activeTimers.delete(room); // Remove from map
        } else {
            activeTimers.get(room).timerValue--;
        }
    }

    // Handle player disconnect
    socket.on('disconnect', () => {
        console.log(`(2)User ${socket.id} disconnected`);
        playersQueue = playersQueue.filter(playerID => playerID !== socket.id); // Remove from queue
        playerCount = Math.max(0, playerCount - 1); // Decrease player count
        console.log(`Current player count: ` + playerCount);
        io.emit("player-count-update", { playerCount }); // Notify others
    });
});

// Start the HTTP server on port 3001
server.listen(3001, () => {
    console.log("Scribblers server is running on port 3001");
});
