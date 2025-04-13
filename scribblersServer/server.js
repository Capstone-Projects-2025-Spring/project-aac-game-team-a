const exp = require('constants'); // Importing constants module (not needed in this case)
const express = require('express'); // Importing Express.js to create the server
const http = require('http'); // Importing HTTP module to create an HTTP server
const { Server } = require('socket.io'); // Importing the Server class from socket.io

const app = express(); // Initializing an Express application
const server = http.createServer(app); // Creating an HTTP server using Express

const GameData = require("./objects/GameData") // Holds all game data needed by server
const SocketHandlerClass = require("./objects/SocketHandler")
const GameSessionsDBClass = require("./Database/GameSessions.js")


// Initializing a new Socket.io server instance and configuring CORS
const io = new Server(server, {
    cors: {
        origin: "*", // Allows connections from any origin (use restrictive policies in production)
        methods: ['GET', "POST"] // Specifies allowed HTTP methods
    }
});

let currentDrawerID = null; //keeps track of current drawer (by socket ID)
let currentDrawerIndex = 0; //index in queue of current drawer
// let currentPrompt = null; //keeps track of current prompt
let playerCount = 0; //number of player that have joined
let correctGuesses = 0; //tracks how many have guessed correctly in a round
let playersQueue = []; //queue of players by socket ID
const maxCycles = 10; //number of cycles (how many times each player draws)
let currentCycle = 0; //tracks cycle number
let imagesPerPrompt = 3; // represents the amount of images to choose from per prompt
let currentPromptObject = null;
let messageBoard = []; // Used to display messages next to avatars in game

const mappedGameData = new Map();
const activeTimers = new Map();
const GameSessionDB = new GameSessionsDBClass()

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
    {word: 'Glove', type: 'Clothing'},
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
]

// Selects a random prompt object
function getPromptObject() {
    const randomIndex = Math.floor(Math.random() * promptList.length);
    return promptList[randomIndex];
}

// Function to form the path to the image
function getPath(promptObject){
    // Get random number to append for the image associated for the prompt 
    let randomImgNumber = Math.floor(Math.random() * imagesPerPrompt) + 1;

    // Ensure the image name is in all lowercase and append the number 
    // Images follow this format: "1image.png", "2image.png", ...
    lowerCaseWord = randomImgNumber + promptObject.word.toLowerCase();

    // Assemble the path
    path = 'promptImages/' + promptObject.type + '/' + promptObject.word + '/' + lowerCaseWord + '.png';

    return path;
}

// Event listener for new socket connections
io.on('connection', (socket) => {

    //  Listen for request to create new lobby
    socket.on("create-new-lobby", () => {
        
        //  Generate new lobby code
        //console.log("generating lobby code...");

        let randomCodeDigits = [];
        let uniqueCodeFound = false;

        while (!uniqueCodeFound) {
            
            //  Generate random values in array
            randomCodeDigits.value = Array.from({ length: 4 }, () =>
                Math.floor(Math.random() * 9) + 1
            );

            //  Check if value is in mapped array
            const newCodeString = randomCodeDigits.value.join('');

            if (io.sockets.adapter.rooms.has(newCodeString)) {
                //console.log(`room ${newCodeString} exists!`)
            }
            else{
                //console.log(`room ${newCodeString} does not exist`)
                uniqueCodeFound = true;
                io.to(socket.id).emit("update-lobby-code", newCodeString);
                const scores = new Map();
                const gameData = new GameData(3, 4, [], "", "", 0, 0, scores);
                mappedGameData.set(newCodeString, gameData);
            }
        }
    });

    // Listens for user joining room
    socket.on('join-room', (code)  => {

        //  Prevent users from joining non-existent rooms
        if (io.sockets.adapter.rooms.has(code)) {
            //console.log(`room ${code} exists!`)
            socket.join(code);
        }
        else{
            //console.log(`room ${code} does not exist!`)
            socket.join(code);
        }
        console.log(`User ${socket.id} is connected to room ${code}`); // Logs when a new user connects
    })
    playerCount++;

    //  Listens for users leaving the room
    socket.on('leave-room', (code) => {
        socket.leave(code);
        console.log(`User ${socket.id} has disconnected from room ${code}`);
        //console.log(io.of("/").adapter.rooms.get(code)); // Print all users in room
    })

    //add player to the queue
    playersQueue.push(socket.id);

    // Keeps track of players currently in game (needs to be refined to be room specific)
    io.emit("player-count-update", { playerCount }); // Notify all players of new count

    // Add players to the message board
    socket.on('add-user-to-message-board', (data) => {
        

    })

    /*
    //assign drawer if there isn't one
    if (!currentDrawerID){
        currentDrawerID = socket.id; //makes this user the drawer
        currentPromptObject.word = getPromptObject(); // Get a random word for the drawer

        // Send "you-are-drawer" and  randomly selected word to the new drawer
        socket.emit('you-are-drawer', { word: currentPromptObject.word });
        console.log(`FIRST DRAWER: User ${socket.id} is the drawer with word: ${currentPromptObject.word}`);

    }*/
    const SocketHandler = new SocketHandlerClass(io, socket, GameSessionDB)
    SocketHandler.createGame()
    SocketHandler.onPlayerJoin()
    SocketHandler.onRoundStart()

    if(currentDrawerIndex === 0 && !currentDrawerID) {
        // Generating game code 
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

        currentPromptObject = getPromptObject();
        let currentPromptImgPath = getPath(currentPromptObject);
        io.to(playersQueue[currentDrawerIndex]).emit('you-are-drawer', 
            {
                word: currentPromptObject.word,
                path: currentPromptImgPath
            });
        console.log(`(1)User ${socket.id} is the drawer with word: ${currentPromptObject.word} with path ${currentPromptImgPath}`);
        // console.log("games session data: " + gamesessions[gameSessionData.sessionID].toString())
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
    socket.on('message', (data, room) => {
        if(data.text != ""){
            //console.log('message received:', data); 

            //process guesses made by non drawing players
            //console.log(`guess incoming from socket.id: ${socket.id}, currentDrawerID: ${currentDrawerID}`);
            if(socket.id !== currentDrawerID) {            
                //correct guess?
                if (data.text.toLowerCase() === currentPromptObject.word.toLowerCase()) {
                    console.log(`Player ${socket.id} guessed correctly!`);

                    /*
                    socket.emit('correct-guess', {
                        user: data.user
                    }); */
                    
                    //message that will show up in the chat upon correct message
                    for(i=0; i<messageBoard.length; i++){ // Loop through each message object in message board
                        if(messageBoard[i].id == socket.id){ // Look for the object with the socket id that matches the current user's socket id
                            messageBoard[i].text = 'Guessed Correctly!'; // Change message to 'Guessed Correctly!'
                            messageBoard[i].imagePath = null; // change to path to checkmark eventually or something
                        }
                    }
                    // Update the message board for all users
                    io.in(room).emit('update-user-message-board', messageBoard);
                    
                    // io.in(room).emit('message:received', data); // Broadcasts received messages to all other clients, including player who guesesd correct
                    correctGuesses++;

                    //check if all guessers have guessed correctly
                    if (correctGuesses === playerCount - 1) {
                        correctGuesses = 0;

                        //next drawer
                        currentDrawerIndex = (currentDrawerIndex + 1) % playersQueue.length;
                        currentPromptObject = getPromptObject();
                        currentPromptImgPath = getPath(currentPromptObject);

                        //notify the previous drawer that they are guessing
                        const previousDrawerIndex = (currentDrawerIndex - 1 + playersQueue.length) % playersQueue.length;
                        io.to(playersQueue[previousDrawerIndex]).emit('you-are-guesser');
                    }

                    //if game isn't over, then assign new drawer
                    if (currentCycle < maxCycles) {
                        currentCycle++;
                        console.log(`Cycle number: ${currentCycle}`);
                        io.to(playersQueue[currentDrawerIndex]).emit('you-are-drawer', {
                            word: currentPromptObject.word,
                            path: currentPromptImgPath 
                        });
                        currentDrawerID = playersQueue[currentDrawerIndex];
                        //console.log(`User ${playersQueue[currentDrawerIndex]} is the drawer with word: ${currentPromptObject.word}, and currentDrawerID is: ${currentDrawerID}`);
                    } else {
                        console.log("End of game.");
                        //TODO: End of game ***
                    }

                } else {
                    // Change the data in the object (socket.id specific)
                    for(i=0; i<messageBoard.length; i++){ // Loop through each message object in message board
                        if(messageBoard[i].id == socket.id){ // Look for the object with the socket id that matches the current user's socket id
                            messageBoard[i].text = data.text; // Change the text based on user input
                            messageBoard[i].imagePath = data.imagePath; // Change the image based on user input
                        }
                    }
                    // socket.to(room).emit('message:received', data); // Broadcasts received messages to all other clients

                    // Update the message board for all users
                    io.in(room).emit('update-user-message-board', messageBoard);
                }
            }
        } else { // This case is for users that have just joined
            let userMessage = {
                id: socket.id, // Set the socket id the server assigned
                user: data.user,  // The user will be assigned
                avatar: data.avatar, // The avater will be assigned
                text: data.text // Test should be blank at this step but will be assigned anyway
            }
            // Push the user message on the board
            messageBoard.push(userMessage);

            // Update the board for every user
            io.emit('update-user-message-board', messageBoard);
        }
    });
    
    //  Listeners for handling drawing data
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

    //  Listener for timer
    socket.on("timer-start", (room, length) => {
        const gameTimer = {
            timerID: setInterval(updateTimer, 1000, room), 
            timerValue: length};
        activeTimers.set(room, gameTimer);
    });

    //  Handles timer functionality
    function updateTimer(room) {
        io.in(room).emit("timer-update", activeTimers.get(room).timerValue);
        
        if (activeTimers.get(room).timerValue == 0) {
            clearInterval(activeTimers.get(room).timerID);
            activeTimers.delete(room);
        }
        else
            activeTimers.get(room).timerValue--;
    };
    
    // Listener for socket disconnections
    socket.on('disconnect', () => {
        console.log(`(2)User ${socket.id} disconnected`); // Logs when a user disconnects
        playersQueue = playersQueue.filter(playerID => playerID !== socket.id); // Remove from queue
        playerCount = Math.max(0, playerCount - 1); // Decrease player count
        console.log(`Current player count: ` + playerCount);
        for(i=0; i<messageBoard.length; i++){
            if(messageBoard[i].id == socket.id){
                messageBoard.splice(i);
                io.emit('update-user-message-board', (messageBoard));
            }
        }
        io.emit("player-count-update", { playerCount }); // Notify others
    });
});

// Start the server and listen on port 3000
server.listen(3001, () => {
    console.log("Scribblers server is running on port 3001");
});
