/**
 * This class handles socket initialization and listening events
 */
//  IMPORTING
const { Server } = require('socket.io'); // Server class from socket.io
const GameData = require("./GameData") // Manages game data for each room

class SocketHandler{

    /**
     * Initialize new Socket.io server instance. Return new server to caller, returns null if fails
     * @param {httpServerInstance} httpServer HTTP server created using express application
     * @returns new server instance on success, 0 on failure
     */
    createServerInstance(httpServer) {
        try {
            const newServerInstance = new Server(httpServer, {
                cors: {
                    origin: "*", // Allows connections from any origin (use restrictive policies in production)
                    methods: ['GET', "POST"] // Specifies allowed HTTP methods
                }
            });
            return newServerInstance;
        } catch (error) {
            console.log(error);
            return 0;
        }   
    }

    /**
     * Start the requested server on the requested port
     * @param {*} httpServer HTTP server created using express application
     * @param {*} port port number to be exposed for client listeners
     */
    startServer(httpServer, port) {
        try {
            httpServer.listen(port, () => {
                console.log(`Scribblers server is running on port ${port}`);
            });
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Initialize Socket.io server listeners to manage client requests
     * @param {*} server Socket.io server instance
     * @param {*} client Socket.io client connecting to server
     * @param {*} gameDataMap Server-side map of game data
     */
    initializeServerListeners(server, client, gameDataMap) {

        //  Listen for start of new game
        client.on('start-game', (room)  => {
        
            console.log(`starting game in room ${room}`)
            client.to(room).emit('start-game');
            gameDataMap.get(room).startNewRound(server, room, gameDataMap);
        })

        //  Listen to play game again
        client.on('play-again', (room)  => {
            console.log(`Playing game again in room ${room}`)
            client.to(room).emit('play-again');
        })

        //  Listen for request to create new lobby
        client.on("create-new-lobby", (numRounds, maxPlayers, players, user) => {
            
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
                if (server.sockets.adapter.rooms.has(newCodeString)) {
                    //  Do nothing and cycle through while loop to try again
                }
                else{
                    uniqueCodeFound = true;
                    server.to(client.id).emit("update-lobby-code", newCodeString);

                    //  Add host to player list if playing
                    let playerData = new Map();
                    if (user) {
                        playerData.set(user, {currentGuess: "", score: 0})
                    }
                    const gameData = new GameData(numRounds, 0, maxPlayers, players, null, "", 0, 0, playerData);
                    gameDataMap.set(newCodeString, gameData);
                    console.log(gameDataMap);
                }
            }
        });

        // Listens for user joining room
        client.on('join-room', (room, user, isHost)  => {

            //  Prevent users from joining non-existent rooms, joining full rooms, or duplicate avatars
            if (server.sockets.adapter.rooms.has(room) && gameDataMap.get(room).playerData.size < gameDataMap.get(room).maxPlayers && !gameDataMap.get(room).playerData.has(user)) {
                //console.log(`room ${room} exists!`)
                client.join(room);
                gameDataMap.get(room).players.push(user)
                gameDataMap.get(room).playerData.set(user, {currentGuess: "", score: 0})
                gameDataMap.get(room).playerData.forEach((value, key) => {
                    server.to(client.id).emit("add-player", key, value);
                })
                server.to(room).emit("update-player-list", gameDataMap.get(room).players);
                client.to(room).emit("add-player", user, {currentGuess: "", score: 0});
                server.to(client.id).emit("update-max-players", gameDataMap.get(room).maxPlayers);
                server.to(client.id).emit("update-round", gameDataMap.get(room).currentRound);
                server.to(client.id).emit("update-num-rounds", gameDataMap.get(room).numberRounds);
                console.log(gameDataMap);
            }
            else{
                //console.log(`room ${room} does not exist!`)
                client.join(room);
                if (!isHost)
                    server.to(client.id).emit("update-user", '');
            }
            console.log(`User ${client.id} is connected to room ${room}`); // Logs when a new user connects
        })

        //  Listens for users leaving the room
        client.on('leave-room', (room, user) => {

            console.log(`User ${client.id} with avatar ${user} has disconnected from room ${room}`);
            client.leave(room);
            if (!gameDataMap.has(room) || !gameDataMap.get(room).playerData.has(user)) return;

            //  Loop through array to find and remove player from array
            let index = 0;
            let arrLength = gameDataMap.get(room).players.length
            for (index = 0; index < arrLength; index++) {
                if (gameDataMap.get(room).players[index] == user) {
                    gameDataMap.get(room).players.splice(index, 1);
                    index = arrLength;
                    //console.log(gameDataMap.get(room).players);
                }
            }
            client.to(room).emit("update-player-list", gameDataMap.get(room).players);
            gameDataMap.get(room).playerData.delete(user)
            client.to(room).emit('remove-player', user)
            console.log(gameDataMap.get(room))

            //  Check if room deleted
            if (!server.of("/").adapter.rooms.get(room)) {
                clearInterval(gameDataMap.get(room).timerID);
                console.log(`room ${room} has been deleted`);

                //  Remove game data from deleted room. Delete() function returns false if key does not exist.
                gameDataMap.delete(room);
                console.log(gameDataMap);
            }
        })

        // Reset the scores of all players
        client.on("reset-scores", (room) => {
            // Get the room map
            let roomDataMap = gameDataMap.get(room)
            // For each user player map in the room data map, get the user's data
            for (const [user, data] of roomDataMap.playerData.entries()) {
                // Set their score to zero
                data.score = 0;
                // Broadcast that all scores are being reset
                server.to(room).to(room).emit("reset-scores", {
                    user,
                    score: 0
                });
            }
        });

        client.on("update-user-guess", (room, user, guess, imagePath, score) => {
            //  update player's guess in game data map and emit to all players in room except sender
            gameDataMap.get(room).playerData.get(user).currentGuess = guess
            gameDataMap.get(room).playerData.get(user).score = score
            client.to(room).to(room).emit("update-user-guess", {
                user,
                guess,
                imagePath,
                score
              });
    
            //  handle all users guessing correctly
            if (gameDataMap.get(room).allGuessesCorrect()) {
                clearInterval(gameDataMap.get(room).timerID);
                //send websocket message for "all guessed correctly message"
                const message = "Everyone Guessed Correctly!"
                server.to(room).emit("all-guessed-correct" , {message}); //emit to everyone including guesser
                gameDataMap.get(room).startNewRound(server, room, gameDataMap);
            }
        });

        client.on("draw-init", (room, x, y, draw_color, draw_width, context) => {
            client.to(room).emit("cast-draw-init", x, y, draw_color, draw_width, context);
        });

        client.on("draw", (room, x, y) => {
            client.to(room).emit("cast-draw", x, y);
            console.log("x: " + x + "    y: " + y)
        });

        client.on("draw-end", (room) => {
            client.to(room).emit("cast-draw-end");
        });

        client.on("draw-clear", (room) => {
            client.to(room).emit("cast-draw-clear");
        });

        client.on("draw-undo", (room) => {
            client.to(room).emit("cast-draw-undo");
        });

        client.on('disconnect', () => {
            console.log(`(2)User ${client.id} disconnected`); // Logs when a user disconnects
        });
    }
}

module.exports = SocketHandler;
