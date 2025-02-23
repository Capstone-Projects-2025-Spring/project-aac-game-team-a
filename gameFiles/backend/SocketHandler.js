/**
 * This class handles real-time WebSocket communication for frontend and backend interactions
 */

class SocketHandler{

    /**
     * Handles all processes related to users joining a session
     * 
     * @param {Socket} socket The socket information linked to the game session
     * @param {string} roomId The room ID number linked to the game session
     * @throws An error if the user could not join the game session
     */
    onPlayerJoin(socket, roomId){
        try {

        } catch (err){
            console.log("User could not join game session");
        }
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
     * @param {Socket} socket The socket information linked to the game session
     * @param {ChatMessage} message The message data specified to be updated to the game server
     * @throws An error if the message data was unable to be updated
     */
    onChatMessage(socket, message){
        try {

        } catch (err){
            console.log("Message data unable to be updated");
        }
    }

    /**
     * Handles all processes related to starting a new round
     * 
     * @param {Socket} socket The socket information linked to the game session
     * @param {GameRoom} room The GameRoom object linked to the game session
     * @throws An error if the round was unable to start
     */
    onRoundStart(socket, room){
        try {

        } catch (err){
            console.log("Round was unable to start");
        }
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
     * @param {Socket} socket The socket information linked to the game session
     * @param {GameRoom} roomID The room ID number linked to the game session
     * @param {string} event The event string used to identify what is being broadcast to the game session
     * @param {any} data The data broadcast to the game session
     * @throws An error if the data was unable to be broadcast to the game session
     */
    broadcastToRoom(socket, roomID, event, data){
        try {

        } catch (err){
            console.log("Data was unable to be broadcast to the game session");
        }
    }
}