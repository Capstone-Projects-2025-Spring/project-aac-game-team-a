/**
 * This class is used to represent chats going to guessing chat
 */
class GuessMessage{
    /**
     * 
     * @param {String} socketID The sender's socket ID (each is unqiue)
     * @param {String} playerAvatar The sender's avatar
     * @param {AACSymbol} symbol The sender's message content
     * @param {String} timestamp When the message was sent
     */
    constructor(socketID, playerAvatar, symbol, timestamp){
        this.socketID = socketID;
        this.playerAvatar = playerAvatar;
        this.symbol = symbol;
        this.timestamp = timestamp;
    }
}
