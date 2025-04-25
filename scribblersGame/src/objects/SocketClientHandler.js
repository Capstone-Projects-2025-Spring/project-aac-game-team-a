/**
 * Handles all socket client events including server connection and listener initialization.
 */
import io from "socket.io-client";

class SocketClientHandler {

    /**
     * Initialize connection to socket server.
     * @param {string} socketServer Hosted socket server address
     * @param {string} testServer Local socket server address
     * @param {boolean} inProduction determines whether to connect to hosted or local server
     */
    initSocketConnection(socketServer, testServer, inProduction) {
        // Establish connection to the WebSocket server
        try {
            if (inProduction) 
                return io(socketServer);
            else 
                return io("http://" + testServer + ":3001");
        } catch (error) {
            console.log("initSocketConnection error: " + error)
        }
        
    }

    //  Create new lobby. If host playing is true, add player to game data
    createLobby(socket, user, isHostPlaying, players, mappedPlayerData, numRounds, maxPlayers) {

        try {
            //  Create new lobby, if host is not playing send null for user to add to player data
            if (isHostPlaying) {
                players.push(user)
                mappedPlayerData.set(user, {
                    currentGuess: "",
                    currentGuessImagePath: "",
                    score: 0
                })
                socket.emit("create-new-lobby", numRounds, maxPlayers, players, user);
            }
            else
                socket.emit("create-new-lobby", numRounds, maxPlayers, players, null);
        } catch (error) {
            console.log("createLobby error: " + error)
        }
        
    }

    // Initialize client-side socket listener events
    initSocketListeners() {

    }

}

export default SocketClientHandler