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
    }

    /**
     * Handles all processes related to users joining a session
     * 
     * @throws An error if the user could not join the game session
     */
    onPlayerJoin(){
        this.socket.on("join_a_room", (data) => {
            try{
                const jsonData = JSON.parse(data);
                console.log('Received JSON data:', jsonData);
                const roomId = jsonData.roomId
                console.log('room id: ' + roomId)
                this.socket.join(roomId)
                this.io.to(roomId).emit("message", this.socket.id + " joined the " + data + " room");
            } catch (error){
                console.log("User could not join game session");
                console.error(err)
            }
            // data = JSON.stringify(data)
            // console.log("message: " + data)
            // const dataNewForm = JSON.parse(data)
            // this.socket.join(dataNewForm.roomId)
            // this.io.to(dataNewForm.roomId).emit("message", this.socket.id + " joined the " + dataNewForm + " room");
            // console.log(this.socket.id + " joined the " + dataNewForm + " room")
        });
        // try {
        //     this.socket.on("join_a_room", (data) => {
        //         console.log("message: " + data.msg)
        //         this.socket.join(data.msg.roomId)
        //         this.io.to(data.msg.roomId).emit("message", this.socket.id + " joined the " + data.msg + " room");
        //         console.log(this.socket.id + " joined the " + data.msg + " room")
        //     });
        // } catch (err){
        //     console.log("User could not join game session");
        //     console.error(err)
        // }
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

                this.io.to(roomId).emit("broad_cast_to_room", JSON.stringify({"message":returnData}));
                console.log(this.socket.id + " sent " + returnData + " to " + roomId +" room")
            } catch (err){
                console.log("Data was unable to be broadcast to the game session");
                console.error(err)
            }
        });
    }
}

module.exports = SocketHandler;
