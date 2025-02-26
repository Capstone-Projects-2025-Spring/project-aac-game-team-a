
/**
 * This class handles all data associated with the drawing canvas
 */
import { Fabric } from 'fabric';
class DrawingCanvas{
    /**
     * Creates the instance of a DrawingCanvas
     * 
     * @param {"pen" | "eraser"} currentTool The current tool being used on the board
     * @param {String} strokeColor The color to draw with
     * @param {number} strokeWidth The width of the pen/eraser
     * @param {string | null} referenceImage The image being displayed to the drawer
     * @throes An error if referenceImage value is not set 
     */
    constructor(currentTool, strokeColor, strokeWidth, referenceImage){
        this.canvas = Fabric.Canvas;
        this.strokeColor = strokeColor;
        this.currentTool = currentTool;
        this.strokeWidth = strokeWidth;
        this.referenceImage = referenceImage;
        // needs to import from "ReferenceImageProvider" class
        if (referenceImage == null){
            throw new Error('reference image not set');
        }
    }
}
