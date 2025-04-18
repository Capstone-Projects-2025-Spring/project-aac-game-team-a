/**
 * 
 */
const exp = require('constants'); // Importing constants module (not needed in this case)
const express = require('express'); // Importing Express.js to create the server
const http = require('http'); // Importing HTTP module to create an HTTP server
const { Server } = require('socket.io'); // Importing the Server class from socket.io

const app = express(); // Initializing an Express application
const server = http.createServer(app); // Creating an HTTP server using Express

const GameData = require("./objects/GameData") // Holds all game data needed by server
const SocketHandlerClass = require("./objects/SocketHandler")
const GameSessionsDBClass = require("./Database/GameSessions.js");

// Initializing a new Socket.io server instance and configuring CORS
const io = new Server(server, {
    cors: {
        origin: "*", // Allows connections from any origin (use restrictive policies in production)
        methods: ['GET', "POST"] // Specifies allowed HTTP methods
    }
});

const roundTimerLength = 60; //set length of round timer
let playerCount = 0; //number of player that have joined
let playersQueue = []; //queue of players by socket ID
let imagesPerPrompt = 3; // represents the amount of images to choose from per prompt
let messageBoard = []; // Used to display messages next to avatars in game

const mappedGameData = new Map();
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

//  Check all guesses, return true if all are correct, return false if there are no correct guesses
function allGuessesCorrect(room) {
    let output = true
    mappedGameData.get(room).playerData.forEach((value, key) => {
        if (key != mappedGameData.get(room).drawer && value.currentGuess != mappedGameData.get(room).prompt.word)       
            output = false
    })
    return output
}

//  Clears all user guesses and updates each user in the room
function clearGuesses(room) {

    mappedGameData.get(room).playerData.forEach((value, key) => {
        
        value.currentGuess = ''
        io.to(room).emit("update-user-guess", key, '')
    })
}

// Event listener for new socket connections
io.on('connection', (socket) => {

    //  Listen for request to create new lobby
    socket.on("create-new-lobby", (numRounds, maxPlayers, players, user) => {
        
        //  Generate new lobby code
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
                //  Do nothing and cycle through while loop to try again
            }
            else{
                uniqueCodeFound = true;
                io.to(socket.id).emit("update-lobby-code", newCodeString);

                //  Add host to player list if playing
                let playerData = new Map();
                if (user) {
                    playerData.set(user, {currentGuess: "", score: 0})
                }
                const gameData = new GameData(numRounds, 0, maxPlayers, players, null, "", 0, 0, playerData);
                mappedGameData.set(newCodeString, gameData);
                console.log(mappedGameData);
            }
        }
    });

    socket.on('start-game', (code)  => {
        
        console.log(`starting game in room ${code}`)
        socket.to(code).emit('start-game');
        startNewRound(code);
    })

    // Listens for user joining room
    socket.on('join-room', (code, user)  => {
        
        //  Prevent users from joining non-existent rooms
        if (io.sockets.adapter.rooms.has(code)) {
            //console.log(`room ${code} exists!`)
            socket.join(code);
            mappedGameData.get(code).players.push(user)
            mappedGameData.get(code).playerData.set(user, {currentGuess: "", score: 0})
            mappedGameData.get(code).playerData.forEach((value, key) => {
                io.to(socket.id).emit("add-player", key, value);
            })
            io.to(code).emit("update-player-list", mappedGameData.get(code).players);
            socket.to(code).emit("add-player", user, {currentGuess: "", score: 0});
            io.to(socket.id).emit("update-max-players", mappedGameData.get(code).maxPlayers);
            io.to(socket.id).emit("update-round", mappedGameData.get(code).currentRound);
            io.to(socket.id).emit("update-num-rounds", mappedGameData.get(code).numberRounds);
            console.log(mappedGameData);
        }
        else{
            //console.log(`room ${code} does not exist!`)
            socket.join(code);
        }
        console.log(`User ${socket.id} is connected to room ${code}`); // Logs when a new user connects
    })
    playerCount++;

    //  Listens for users leaving the room
    socket.on('leave-room', (code, user) => {

        //  Loop through array to find and remove player from array
        let index = 0;
        let arrLength = mappedGameData.get(code).players.length
        for (index = 0; index < arrLength; index++) {
            if (mappedGameData.get(code).players[index] == user) {
                mappedGameData.get(code).players.splice(index, 1);
                index = arrLength;
                //console.log(mappedGameData.get(code).players);
            }
        }
        socket.leave(code);
        socket.to(code).emit("update-player-list", mappedGameData.get(code).players);
        mappedGameData.get(code).playerData.delete(user)
        socket.to(code).emit('remove-player', user)
        console.log(mappedGameData.get(code))
        console.log(`User ${socket.id} has disconnected from room ${code}`);

        //  Check if room deleted
        if (!io.of("/").adapter.rooms.get(code)) {
            clearInterval(mappedGameData.get(code).timerID);
            console.log(`room ${code} has been deleted`);

            //  Remove game data from deleted room. Delete() function returns false if key does not exist.
            mappedGameData.delete(code);
            console.log(mappedGameData);
        }

        //console.log(io.of("/").adapter.rooms.get(code)); // Print remaining users in room
    })

    //add player to the queue
    playersQueue.push(socket.id);

    // Keeps track of players currently in game (needs to be refined to be room specific)
    io.emit("player-count-update", { playerCount }); // Notify all players of new count

    const SocketHandler = new SocketHandlerClass(io, socket, GameSessionDB)
    SocketHandler.createGame()
    SocketHandler.onPlayerJoin()
    SocketHandler.onRoundStart()

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

    socket.on("update-user-guess", (room, user, guess) => {
        //  update player's guess in game data map and emit to all players in room except sender
        mappedGameData.get(room).playerData.get(user).currentGuess = guess
        socket.to(room).emit("update-user-guess", user, guess);

        //  handle all users guessing correctly
        if (allGuessesCorrect(room)) {
            clearInterval(mappedGameData.get(room).timerID);
            startNewRound(room);
        }
    });

    //  Function to start new round
    function startNewRound(room) {

        console.log(`Starting new round in room ${room}...`)
        clearGuesses(room);
        console.log(mappedGameData.get(room).playerData);
        if (mappedGameData.get(room).currentRound != 0)
            io.to(room).emit("cast-draw-clear");

        //  Increment round count and verify it is not end of round
        mappedGameData.get(room).currentRound++
        if (mappedGameData.get(room).currentRound > mappedGameData.get(room).numberRounds) {
            mappedGameData.get(room).currentRound = 0
            io.to(room).emit('end-game');
            return;
        }

        //  Select new drawer for room and update current drawer for all users in room
        let newDrawerSelected = false;
        while (!newDrawerSelected) {
            //  Randomly select player from players array
            randomIndex = Math.floor(Math.random() * mappedGameData.get(room).players.length);
            
            //  Verify new drawer is not the current drawer
            if (mappedGameData.get(room).drawer == mappedGameData.get(room).players[randomIndex])
                console.log(`${mappedGameData.get(room).drawer} is already drawing, choosing new drawer`)
            else {
                //  Set as new drawer and update all users in room
                mappedGameData.get(room).drawer = mappedGameData.get(room).players[randomIndex];
                console.log(`${mappedGameData.get(room).drawer} chosen as drawer`)
                io.to(room).emit('update-drawer', mappedGameData.get(room).drawer);
                newDrawerSelected = true;
            }
        }
        
        //  Generate new prompt and update prompt for all users in room
        mappedGameData.get(room).prompt = getPromptObject();
        io.to(room).emit('update-prompt', mappedGameData.get(room).prompt, getPath(mappedGameData.get(room).prompt));

        //  Start Round Timer
        mappedGameData.get(room).timerValue = roundTimerLength;
        mappedGameData.get(room).timerID = setInterval(updateTimer, 1000, room);
        console.log(mappedGameData.get(room))
    }

    //  Handles timer functionality
    function updateTimer(room) {
        
        try {
            io.in(room).emit("timer-update", mappedGameData.get(room).timerValue);
            
            if (mappedGameData.get(room).timerValue == 0) {
                clearInterval(mappedGameData.get(room).timerID);
                startNewRound(room);
            }
            else
                mappedGameData.get(room).timerValue--;
        }
        catch{
            console.error(`Error during timer update in room ${room}, clearing timer interval`)
        }
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
