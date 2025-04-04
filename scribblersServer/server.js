const exp = require('constants'); // Importing constants module (not needed in this case)
const express = require('express'); // Importing Express.js to create the server
const http = require('http'); // Importing HTTP module to create an HTTP server
const { Server } = require('socket.io'); // Importing the Server class from socket.io

const app = express(); // Initializing an Express application
const server = http.createServer(app); // Creating an HTTP server using Express

const GameSessionClass = require("./objects/GameSessionClass")
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

const activeTimers = new Map();
const GameSessionDB = new GameSessionsDBClass()


//drawing prompt word list
// NOT BEING USED
const wordsList = [
    'eat', 'jump', 'run', 'sleep', 'bird', 'cat', 'dog', 'elephant', 
    'horse', 'mouse', 'glasses', 'glove', 'hat', 'pants', 'shirt', 
    'shoe', 'apple', 'banana', 'carrot', 'grapes', 'pizza', 'spaghetti'
];

// drawing prompt objects
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
]

// Function to select a random word from the list
function getPromptObject() {
    const randomIndex = Math.floor(Math.random() * promptList.length); // get index for random prompt object
    const promptObject = promptList[randomIndex]; // get random prompt object

    return promptObject;
}

// Function to form the path to the image
function getPath(promptObject){
    if(promptObject == null){
        
    }
    // Get random number to append for the image associated for the prompt 
    let randomImgNumber = Math.floor(Math.random() * imagesPerPrompt) + 1;

    // Ensure the image name is in all lowercase and append the number 
    // Images follow this format: "1image.png", "2image.png", ...
    lowerCaseWord = randomImgNumber + promptObject.word.toLowerCase();

    // Assemble the path
    path = 'promptImages/' + promptObject.type + '/' + promptObject.word + '/' + lowerCaseWord + '.png';

    // for testing
    console.log(path);

    return path;
}

// Event listener for new socket connections
io.on('connection', (socket) => {
    socket.on('join-room', (code)  => {
        socket.join(code);
        console.log(`User ${socket.id} is connected to room ${code}`); // Logs when a new user connects
    })
    // playerCount++;

    //add player to the queue
    // playersQueue.push(socket.id);

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
    SocketHandler.createGame() // Creates the game
    SocketHandler.onPlayerJoin() // Allows each player to join a game
    SocketHandler.onRoundStart() // Starts a new round

    // if(currentDrawerIndex === 0 && !currentDrawerID) {
    //     // Generating game code 
    //     const randomNumbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9));
    //     const randomInteger = parseInt(randomNumbers.join(""), 10);
    //     console.log(randomInteger);

    //     // // grab number of players
    //     // let numbPlayers = 4
    //     // // grab number of rounds
    //     // let numbRounds = 3
    //     // // grab the a player
    //     // currentDrawerID = socket.id; //assigns first user to join's ID to currentDrawerID
    //     // // Generating game session data
    //     // let gameSessionData = new GameSessionClass(randomInteger,[currentDrawerID], numbRounds, numbPlayers, null)
    //     // gamesessions[gameSessionData.sessionID] = gameSessionData

    //     currentPromptObject = getPromptObject();
    //     let currentPromptImgPath = getPath(currentPromptObject);
    //     io.to(playersQueue[currentDrawerIndex]).emit('you-are-drawer', 
    //         {
    //             word: currentPromptObject.word,
    //             path: currentPromptImgPath
    //         });
    //     console.log(`(1)User ${socket.id} is the drawer with word: ${currentPromptObject.word} with path ${currentPromptImgPath}`);
    //     // console.log("games session data: " + gamesessions[gameSessionData.sessionID].toString())
    // }

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
        //console.log('message received:', data); 

        //process guesses made by non drawing players
        //console.log(`guess incoming from socket.id: ${socket.id}, currentDrawerID: ${currentDrawerID}`);
        if(socket.id !== currentDrawerID) {
            if (data.text.toLowerCase() === currentPromptObject.word.toLowerCase()) {
                console.log(`Player ${socket.id} guessed correctly!`);

                /*
                socket.emit('correct-guess', {
                    user: data.user
                }); */
                data.text = 'Guessed Correctly!';

                
                io.in(room).emit('message:received', data); // Broadcasts received messages to all other clients, including player who guesesd correct
                correctGuesses++;

                //check if all guessers ahve guessed correctly
                if (correctGuesses === playerCount - 1) {
                    correctGuesses = 0;

                    //next drawer
                    currentDrawerIndex = (currentDrawerIndex + 1) % playersQueue.length;
                    currentPromptObject.word = getPromptObject();

                    //notify the previous drawer that they are guessing
                    const previousDrawerIndex = (currentDrawerIndex - 1 + playersQueue.length) % playersQueue.length;
                    io.to(playersQueue[previousDrawerIndex]).emit('you-are-guesser');
                }

                //check if max cycles have been reached
                if (currentCycle < maxCycles) {
                    currentCycle++;
                    io.to(playersQueue[currentDrawerIndex]).emit('you-are-drawer', {word: currentPromptObject.word});
                    currentDrawerID = playersQueue[currentDrawerIndex];
                    //console.log(`User ${playersQueue[currentDrawerIndex]} is the drawer with word: ${currentPromptObject.word}, and currentDrawerID is: ${currentDrawerID}`);
                } else {
                    console.log("End of game.");
                    //TODO: End of game ***
                }

            }
            socket.to(room).emit('message:received', data); // Broadcasts received messages to all other clients
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
    function updateTimer(room){
        io.in(room).emit("timer-update", activeTimers.get(room).timerValue);
        
        if (activeTimers.get(room).timerValue == 0) {
            clearInterval(activeTimers.get(room).timerID);
            activeTimers.delete(room);
        }
        else
            activeTimers.get(room).timerValue--;
    }
    
    // Listener for socket disconnections
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`); // Logs when a user disconnects

        //TODO: at some point, handle people disconnecting
    });
});

// Start the server and listen on port 3000
server.listen(3001, () => {
    console.log("Scribblers server is running on port 3001");
});
