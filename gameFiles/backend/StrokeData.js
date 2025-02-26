
/**
 * This class represents all data associated to an indiviudal stroke drawn on the canvas
 */
class StrokeData{
    /**
     * Creates an instance of a StrokeData object to store data of individual drawing strokes on the canvas
     * 
     * @param {number} xCoord The X-coordinate of the drawing position on the canvas
     * @param {number} yCoord The Y-coordinate of the drawing position on the canvas
     * @param {string} color The selected color at the time of creation of StrokeData object
     * @param {number} size The size of the drawing used for proper scaling of the drawing
     */
    constructor(xCoord, yCoord, color, size){
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.color = color;
        this.size = size;
    }
}
