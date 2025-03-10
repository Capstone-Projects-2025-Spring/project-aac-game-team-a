/**
 * This class handles real-time WebSocket communication for frontend and backend interactions
 */

class SocketHandler{

    /**
     * Handles the initialization of the socket handler
     * 
     * @param {IO} io deals with 
     * @param {Socket} socket Handles the object
     */
    constructor(io, socket){
        this.io = io
        this.socket = socket

        console.log(this.io)
        console.log(this.socket.join("hi"))
        socket.emit("hi")
    }

    /**
     * Handles all processes related to users joining a session
     * 
     * @param {Socket} socket The socket information linked to the game session
     * @param {string} roomId The room ID number linked to the game session
     * @throws An error if the user could not join the game session
     */
    onPlayerJoin(data){
        try {
            this.socket.on("join_a_room", (data) => {
                console.log("message: " + data.msg)
                this.socket.join(data.msg.roomId)
                this.io.to(data.msg.roomId).emit("message", this.socket.id + " joined the " + data.msg + " room");
                console.log(this.socket.id + " joined the " + data.msg + " room")
            });
        } catch (err){
            console.log("User could not join game session");
            console.error(err)
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
     * @throws An error if the message data was unable to be updated
     */
    onChatMessage(){
        try {
            this.socket.on("on_chat_message", (data) => {
                this.io.to(data.msg.roomId).emit("message", this.socket.id + " joined the " + data.msg + " room");
                console.log(this.socket.id + " joined the " + data.msg + " room")
            });

        } catch (err){
            console.log("Message data unable to be updated");
        }
    }

    /**
     * Handles all processes related to starting a new round
     * 
     * @throws An error if the round was unable to start
     */
    onRoundStart(){
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
     * @throws An error if the data was unable to be broadcast to the game session
     */
    broadcastToRoom(){
        try {
            this.socket.on("broad_cast_to_room", (data) => {
                this.io.to(data.msg.roomId).emit("message", this.socket.id + " joined the " + data.msg + " room");
                console.log(this.socket.id + " joined the " + data.msg + " room")
            });

        } catch (err){
            console.log("Data was unable to be broadcast to the game session");
        }
    }
}

module.exports = SocketHandler;
