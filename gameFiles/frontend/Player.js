
/**
 * Represents a player in game
 */
class Player{
    /**
     * Used to create an instance of a player in the game
     * 
     * @param {String} avatar The avatar that represents the player
     * @param {number} score The player's score
     * @param {boolean} isDrawing Used to determine if the player is currently drawing
     * @param {String} socketID The player's socket ID (each is unique)
     */
    constructor(avatar, score, isDrawing, socketID){
        this.avatar = avatar;
        this.score = score;
        this.isDrawing = isDrawing;
        this.socketID = socketID;
    }
}
