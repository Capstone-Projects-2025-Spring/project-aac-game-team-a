/** This class stores all drawing data related to a player's drawing 
*/ 
class DrawingData{
    /**
     * Creates an instance of a DrawingData object to send between server and client 
     * 
     * @param {string} socketId The socket ID associated to the drawing data (each is unique)
     * @param {StrokeData[]} strokes The array of stroke objects drawn by the drawer
     * @param {Date} timeStamp The date and time of creation of drawing data
     * @param {number} roundNumber The round number of the current game
     */
    constructor(socketId, strokes, timeStamp, roundNumber){
        this.socketId = socketId;
        this.strokes = strokes;
        this.timeStamp = timeStamp;
        this.roundNumber = roundNumber;
    }
}