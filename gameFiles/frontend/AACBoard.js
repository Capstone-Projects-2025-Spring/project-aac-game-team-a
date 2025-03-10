/**
 * This class handles AAC board interactions
 */
// Import the class "AACSymbol" to be used in this class
import './AACSymbol.js';
class AACBoard {
    /**
     * Creates a new AAC Board instance
     * 
     * @param {number} boardId ID of the AAC board used for the game
     * @param {AACSymbol[]} AACSymbols An array of symbols being used
     * @param {AACSymbol} selectedSymbol Reference to a symbol being selected during a game
     */
    constructor(boardId, AACSymbols, selectedSymbol){ 
        
        this.boardId = boardId;
        this.AACSymbols = AACSymbols;
        this.selectedSymbol = AACSymbol | null;
    }

    /**
     * Fetches a specific AAC board from the AsTeRICS Grid based on the ID
     * 
     * @param {String} boardId The ID of the board to be fetched
     * @throws An error if it cannot reference the board
     */
    fetchBoard(boardId){
        try {

        } catch (err){
            console.log("Could not fetch AAC Board");
        }
    }

    /**
     * Selects the symbol from the specified AAC Board
     * 
     * @param {String} symbolId The ID of the symbol to be selected
     * @throws An error if it cannot reference the symbol
     */
    selectSymbol(symbolId){
        try {

        } catch (err){
            console.log("Could not select symbol from AAC Board");
        }
    }
    
    /**
     * Handles the functionality of sending a symbol to the underlying guessing chat
     * 
     * @param {AACSymbol} symbol The symbol to be sent
     * @throws An error if it cannot send a symbol
     */
    sendSymbolToChat(symbol){
        try {

        } catch (err){
            console.log("Could not send AAC symbol to guessing interface");
        }
    }

    /**
     * Clears the currently selected symbol
     * @throws An error if it cannot clear the current symbol
     */
    clearSelection(){
        try {

        } catch (err){
            console.log("Could not clear currently selected symbol");
        }
    }
}