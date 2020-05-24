/**
 * Canvas documentation:
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 */
class Canvas {
    constructor(canvas) {
        this.view = canvas;
        this.context = canvas.getContext('2d');
    }

    clear(props) {
        if (typeof(props) === "object" && ["x", "y", "w", "h"].every(key => props.hasOwnProperty(key))) {
            this.context.clearRect(props.x, props.y, props.w, props.h);
        } else {
            this.context.clearRect(0, 0, this.view.width, this.view.height);
        }        
    }

    draw(shape, props) {
        shape.draw(this, props);
    }

    /**
     * context.scale(x, y)
     * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scale
     * @param {number} x 
     * @param {number} y 
     */
    setScale(x, y) {
        this.context.scale(x, y);
    }
    
    getZoomFactor() {
        return Math.abs(this.context.getTransform().a);
    }
    
    setZoomFactor(z) {
        let tmatrix = this.context.getTransform();
        tmatrix.a = Math.sign(tmatrix.a) * z;
        tmatrix.d = Math.sign(tmatrix.d) * z;
        this.context.setTransform(tmatrix);
        return Math.abs(tmatrix.a) * z;
    }

    zoomIn() {
        this.setZoomFactor(this.getZoomFactor() + 0.2);
        // return this.context.getTransform();
        return this.getZoomFactor().toFixed(2);
    }

    zoomOut() {
        this.setZoomFactor(this.getZoomFactor() - 0.2);
        // return this.context.getTransform();
        return this.getZoomFactor().toFixed(2);
    }
}

/**
 * scale() - adds a scaling transformation to the canvas units horizontally and/or vertically
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scale
 * 
 * setTransform() - resets (overrides) the current transformation to the identity matrix
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform
 * 
 * 
 */