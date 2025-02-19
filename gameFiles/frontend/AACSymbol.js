/**
 * Represents a symbol on a board
 */
class AACSymbol{
    /**
     * Creates an instance of an AACSymbol using an AAC Board in the AsTeRICS API
     * 
     * @param {string} imageUrl The URL to the image of the symbol
     * @param {string} symbolId The ID of the symbol to be fetched
     * @param {string} label The label assigned to the symbol
     * @param {string} category The category the symbol falls in
     */
    constructor(imageUrl, symbolId, label, category){
        this.imageUrl = imageUrl;
        this.symbolId = symbolId;
        this.label = label;
        this.category = category;
    }
}