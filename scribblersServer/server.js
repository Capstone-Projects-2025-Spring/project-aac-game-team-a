/**
 * This file it the main executable for the Scribblers backend. Node, Express, and Socket.io 
 * are used to listen for requests and send/recieve game data.
 */
//  IMPORTING
const express = require('express'); // Creates backend server
const http = require('http'); // Creates HTTP server
const SocketServerHandler = require("./objects/SocketServerHandler.js"); // Manages socket server interactions

//  INITIALIZATIONS
const app = express(); // Express initialization
const server = http.createServer(app); // Create HTTP server using Express
const mappedGameData = new Map(); // Create global map to manage game data objects
const SocketServer = new SocketServerHandler(); // Create socket manager
const io = SocketServer.createServerInstance(server); // Create Socket.io server instance

//  GAME SETTINGS
const roundTimerLength = 60; //set length of round timer
let imagesPerPrompt = 3; // represents the amount of images to choose from per prompt

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
        if (key != mappedGameData.get(room).drawer && value.currentGuess != "Correct!")       
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
    
    SocketServer.initializeServerListeners(io, socket, mappedGameData);
    
    socket.on('start-game', (code)  => {
        
        console.log(`starting game in room ${code}`)
        socket.to(code).emit('start-game');
        startNewRound(code);
    })
    
    socket.on("update-user-guess", (room, user, guess, imagePath) => {
        //  update player's guess in game data map and emit to all players in room except sender
        mappedGameData.get(room).playerData.get(user).currentGuess = guess
        socket.to(room).emit("update-user-guess", user, guess, imagePath);

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
        io.to(room).emit('update-round', mappedGameData.get(room).currentRound);
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

            if (!mappedGameData.get(room).playerData) {
                clearInterval(mappedGameData.get(room).timerID)
                mappedGameData.delete(room) 
            }
            
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
});

SocketServer.startServer(server, 3001);
