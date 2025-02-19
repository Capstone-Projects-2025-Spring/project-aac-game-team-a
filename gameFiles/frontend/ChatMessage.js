/**
 * This class is used to represent chats going to guessing chat
 */
class ChatMessage{
    /**
     * 
     * @param {String} socketID The sender's socket ID (each is unqiue)
     * @param {String} playerAvatar The sender's avatar
     * @param {String} message The sender's message content
     * @param {"text" | "symbol"} messageType The type of content the message holds
     * @param {String} timestamp When the message was sent
     */
    constructor(socketID, playerAvatar, message, messageType, timestamp){
        this.socketID = socketID;
        this.playerAvatar = playerAvatar;
        this.message = message;
        this.messageType = messageType;
        this.timestamp = timestamp;
    }
}