/**
 * Canvas documentation:
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 */
class Canvas {
    constructor(canvas) {
        this.view = canvas;
        this.context = canvas.getContext('2d');
        this.zoom = 1;
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
    
    setZoom(z) {
        this.zoom = z;
        this.context.scale(this.zoom, this.zoom);
        return this.zoom;
    }

    zoomIn() {
        if (this.zoom < 1) {
            this.zoom += 1/10;
        } else {
            this.zoom += 0.5;
        }
        this.context.scale(this.zoom, this.zoom);
        return this.zoom;
    }

    zoomOut() {
        if (this.zoom <= 1) {
            this.zoom -= 1/10;
        } else {
            this.zoom -= 0.5;
        }
        this.context.scale(this.zoom, this.zoom);
        return this.zoom;
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