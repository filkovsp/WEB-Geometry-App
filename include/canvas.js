/**
 * Canvas documentation:
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 */
class Canvas {
    constructor(canvas) {
        this.view = canvas;
        this.context = canvas.getContext('2d');
        this.frame = {x: 0, y: 0, w: this.view.width, h: this.view.height};
        this.zoomStep = 0.2;
    }

    draw(shape, props) {
        shape.draw(this, props);
    }

    /**
     * Clears all visible area.
     * visible area is a "phisical" canvas 
     * being projected on to context
     * and scaled to the scale factor.
     */
    clear() {
        this.context.clearRect(
            this.frame.x / this.getZoomFactor(), 
            this.frame.y / this.getZoomFactor(), 
            this.frame.w / this.getZoomFactor(), 
            this.frame.h / this.getZoomFactor()
        );
    }

    clearAndReset() {
        this.clear();
        this.context.resetTransform();
    }

    /**
     * Adds a scaling transformation to the canvas units horizontally and/or vertically
     * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scale
     * @param {number} x Scale factor for x axis
     * @param {number} y Scale factor for y axis
     */
    setScale(x, y) {
        this.context.scale(x, y);
    }
    
    /**
     * Terurns abs(scale factor) for x axis.
     */
    getZoomFactor() {
        return Math.abs(this.context.getTransform().a);
    }
    
    setZoomFactor(z) {
        /**
         * TMatrix: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getTransform
         * [a, b, c, d, e, f]:
         * a - scale factor for x axis
         * d - scale factor for y axis
         * e - offset for x axis
         * f - offset for y axis
         */
        let tmatrix = this.context.getTransform();
        tmatrix.a = Math.sign(tmatrix.a) * z;
        tmatrix.d = Math.sign(tmatrix.d) * z;
        /**
         * context.setTransform(tmatrix) method
         * resets (overrides) the current transformation to the identity matrix
         */
        this.context.setTransform(tmatrix);
        return Math.abs(tmatrix.a) * z;
    }

    zoomIn() {
        this.setZoomFactor(this.getZoomFactor() + this.zoomStep);
        return this.getZoomFactor().toFixed(2);
    }

    zoomOut() {
        // limit min(Zoom Factor) to a single Zoom Step value:
        if (this.getZoomFactor() > 2 * this.zoomStep) {
            this.setZoomFactor(this.getZoomFactor() - this.zoomStep);
        }
        
        return this.getZoomFactor().toFixed(2);
    }

    /**
     * Move drawing frame with its zero-point (0x, 0y) = (0, 0) to a new position:
     * _________ 
     * |    . . | . .
     * |____.___|   .
     *      . . . . .
     * New Zero-point will become then (0 + x, 0 + y) - moved towards the center of view.
     * Drawing frame will have its visibility on range of coordinates: 
     *  x = range(0 - x, 0 + view.width - x);
     *  y = range(0 - y, 0 + view.hight - y)
     * This imitates view port being moved aside with drawn elements hidden behind its border.
     * If there are some elements drawn behind view frame, we need to keep them in our context.
     * Hence used coordiantes for the context are going to extend, but view port will be able
     * to show only part of it, that it might phisically accomodate.
     * 
     * @param {number} x Context offset by X axis
     * @param {number} y Context offset by Y axis
     */
    translate(x, y) {
        this.frame.x = -1 * Math.max(0, x);
        this.frame.y = -1 * Math.max(0, y);
        this.frame.w = this.view.width + Math.abs(x);
        this.frame.h = this.view.height + Math.abs(y);
        this.context.translate(x, y);
    }

    /**
     * Returns coordinates on a virtual context area,
     * for the "phisical" canvas being projected on the "virtual cantext":
     * 
     *    .  . . . . . . . 
     *    . _________    .
     *    . |        |   .
     *    . |________|   .
     *    . . .  . . . . .
     * 
     */
    getViewPort() {
        return {
            min: {x: this.frame.x, y: this.frame.y},
            max: {x: this.view.width + this.frame.x, y: this.view.height + this.frame.y}
        };
    }
}