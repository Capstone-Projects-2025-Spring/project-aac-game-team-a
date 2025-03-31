const GameSessionClass = require("./GameSessionClass")

/**
 * This class handles real-time WebSocket communication for frontend and backend interactions
 */

class SocketHandler{

    /**
     * Handles the initialization of the socket handler
     * 
     * @param {IO} io deals with 
     * @param {Socket} socket Handles the object
     * @param {GameSessions} gameSessions Acts as the database for the game
     */
    constructor(io, socket, gameSessions){
        this.io = io
        this.socket = socket
        this.gameSession = gameSessions // Holds all of the games being played (key: sessionID)
    }
    
    // Function to select a random word from the list
    getRandomWord() {
        const wordsList = [
            'eat', 'jump', 'run', 'sleep', 'bird', 'cat', 'dog', 'elephant', 
            'horse', 'mouse', 'glasses', 'glove', 'hat', 'pants', 'shirt', 
            'shoe', 'apple', 'banana', 'carrot', 'grapes', 'pizza', 'spaghetti'
        ];
        const randomIndex = Math.floor(Math.random() * wordsList.length);
        return wordsList[randomIndex];
    }

    logDataRecieved(socketId, jsonData){
        console.log("data sent from " + socketId)
        console.log("data sent: " + jsonData)
    }

    createGame(){
        this.socket.on("create_game", (data) => {
            try{

                // Converting data into json
                // const jsonData = JSON.parse(data);
                this.logDataRecieved(this.socket.socketId, JSON.stringify(data))


                // Generating game code 
                const randomInteger = data.sessionID

                // grab number of players
                let numbPlayers = data.playersNum
                // grab number of rounds
                let numbRounds = data.roundsNum
                // grab the a player
                let currentDrawerID = this.socket.id; //assigns first user to join's ID to currentDrawerID
                //gamesessions[gameSessionData.sessionID] = gameSessionData

                let currentPrompt = this.getRandomWord();
                console.log("current prompt: " + currentPrompt)

                // Generating game session data
                let gameSessionData = new GameSessionClass(
                    randomInteger, [currentDrawerID], numbRounds, 0, null, currentPrompt, currentDrawerID, numbPlayers
                )
                console.log("sessionID type: "+ typeof gameSessionData.sessionID)
                this.gameSession.saveSession(gameSessionData)
                console.log("gamesession data: " + this.gameSession.retrieveSession(gameSessionData.sessionID).toString())
                console.log("sessions: " + JSON.stringify(this.gameSession))


                this.socket.join(randomInteger)
                this.io.to(randomInteger).emit('drawer', {"message": gameSessionData.toJson()});
                console.log(`User ${this.socket.id} is the drawer with word: ${currentPrompt}`);
                //console.log("games session data: " + gamesessions[gameSessionData.sessionID].toString())
                // const jsonData = JSON.parse(data);
                // console.log('Received JSON data:', jsonData);
                // const roomId = jsonData.roomId
                // console.log('room id: ' + roomId)
                // this.socket.join(roomId)
                // this.io.to(roomId).emit("message", this.socket.id + " joined the " + data + " room");
            } catch (error){
                console.log("Was not able to create game lobby");
                console.error(error)
            }
        });
    }

    /**
     * Handles all processes related to users joining a session
     * 
     * @throws An error if the user could not join the game session
     */
    onPlayerJoin(){
        this.socket.on("join_a_room", (data) => {
            try{
                // const jsonData = JSON.parse(data);
                console.log('Received JSON data:', data);
                const roomId = data.sessionID
                console.log('room id: ' + roomId)
                console.log("sessionID type: ", typeof roomId)

                this.socket.join(roomId)
                // console.log(this.gameSession)
                const gameData = this.gameSession.retrieveSession(roomId);
                console.log("game data: " + gameData.toString())
                gameData.players.push(this.socket.id)

                this.io.to(roomId).emit("message", {"message": gameData.toJson()});
            } catch (error){
                console.log("User could not join game session");
                console.error(error)
            }
        });
    }

    /**
     * Handles all processes related to users leaving a session
     * 
     * @param {Socket} socket The socket information linked to the game session
     * @param {string} roomId The room ID number linked to the game session
     * @throws An error if the user could not leave the game session
     */
    onPlayerLeave(socket, roomId){
        try {

        } catch (err){
            console.log("User could not leave game session");
        }
    }

    /**
     * Handles all processes related to the drawing on the canvas
     * 
     * @param {Socket} socket The socket information linked to the game session
     * @param {DrawingData} data The drawing data specified to be updated to the game server
     * @throws An error if the drawing data was unable to be updated
     */
    onDrawingData(socket, data){
        try {

        } catch (err){
            console.log("Drawing data unable to be updated");
        }
    }

    /**
     * Handles all processes related to processing guesses in the form of chat messages
     * 
     * @throws An error if the message data was unable to be updated
     */
    onChatMessage(){
        this.socket.on("on_chat_message", (data) => {
            console.log("on_chat_message log")
            try {
                const jsonData = JSON.parse(data);
                console.log('Received JSON data:', jsonData);
                const roomId = jsonData.roomId
                console.log('room id: ' + roomId)
                const returnData = {
                    "roomID": roomId, 
                    "msg": jsonData.msg, 
                    "sender": this.socket.id
                }
                this.io.to(roomId).emit("on_chat_message", JSON.stringify({"message":returnData}));
                console.log(this.socket.id + " sent " + {"message":data} + " to " + roomId +" room")
    
            } catch (err){
                console.log("Message data unable to be updated");
                console.error(err)
            }
        });
    }

    /**
     * Handles all processes related to starting a new round
     * 
     * @throws An error if the round was unable to start
     */
    onRoundStart(){
        this.socket.on("on_round_start", (data) => {
            try{
                // const jsonData = JSON.parse(data);
                console.log('Received JSON data: '+ JSON.stringify(data));
                const roomId = data.sessionID
                console.log('room id: ' + roomId)
                console.log("sessionID type: "+ typeof roomId)

                // console.log(this.gameSession)
                const gameData = this.gameSession.retrieveSession(roomId);
                console.log("Game data: " + gameData.toString())

                let currentPrompt = this.getRandomWord();
                console.log("current prompt: " + currentPrompt)

                let drawer = gameData.players.pop()

                const startGameResult = gameData.startRound(currentPrompt, drawer)
                if(!startGameResult){
                    this.io.to(roomId).emit("message", {"error": 'Game over'});
                }

                gameData.players.push(drawer)
                this.io.to(roomId).emit("message", {"message": gameData.toJson()});
            } catch (error){
                console.log("User was not able to go to next round");
                console.error(error)
            }
        });
    }

    /**
     * Handles all processes related to ending a round
     * 
     * @param {Server} io The socket.io server information linked to the game session
     * @param {GameRoom} room The GameRoom object linked to the game session
     * @throws An error if the round was unable to end
     */
    onRoundEnd(io, room){
        try {

        } catch (err){
            console.log("Round was unable to start");
        }
    }

    /**
     * Handles all processes related to updating game data to all players in the game session
     * 
     * @throws An error if the data was unable to be broadcast to the game session
     */
    broadcastToRoom(){
        this.socket.on("broad_cast_to_room", (data) => {
            console.log("broad_cast_to_room logs")
            try {
                const jsonData = JSON.parse(data);
                console.log('Received JSON data:', jsonData);
                const roomId = jsonData.roomId
                console.log('room id: ' + roomId)
                const returnData = {
                    "roomID": roomId, 
                    "msg": jsonData.msg, 
                    "sender": this.socket.id
                }

                this.io.to(roomId).emit("broad_cast_to_room", JSON.stringify({"message": returnData}));
                console.log(this.socket.id + " sent " + returnData + " to " + roomId +" room")
            } catch (err){
                console.log("Data was unable to be broadcast to the game session");
                console.error(err)
            }
        });
    }
}

module.exports = SocketHandler;
