/**
 * Shapes documentaion:
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
 * 
 * Also short reference here:
 * https://www.khanacademy.org/computing/computer-programming/programming/drawing-basics/pc/challenge-waving-snowman
 * follow the Documentation tab at the bottom.
 */

/**
 * Shape is an Abstract Class, should not be instanciated directly.
 * But one of the clases below that extend Shape must be used for drawing a particular shape.
 */
class Shape {
    constructor() {
        this.color = "rgb(0, 0, 0)";
        this.fillColor = "rgb(0, 0, 0)";
    }
    
    /**
     * Interface to set Shape's line-color property
     * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors
     * @param {*} color 
     */
    setColor(color) {
        this.color = color;
    }

    /**
     * Interface to set Shape's fill-color property
     * @param {*} color 
     */
    setFillColor(color) {
        this.fillColor = color;
    }

    /**
     * Interface for the Shape's specific method that returns object of properties 
     * required by shape to draw it out of two coordinates at the canvas: 
     * starting and ending points.
     * @param {Object} coordinates {start: {x, y}, end: {x, y}}
     */
    getPropsFromCoordinates(coordinates) {
        throw new Error("implement this method in Child class");
    }

    /**
     * Method that validates
     * whether we receive in props just to points {start: {x, y}, end: {x, y}}
     * or, this is shape-speciwic params for drawing particular shape.
     * I you use this method in CHild class, then make sure you implement also
     * getPropsFromCoordinates() in the same class.
     * @param {*} props 
     */
    validateProps(props) {
        if (typeof(props) === "object" && ["start", "end"].every(key => props.hasOwnProperty(key))) {
            return this.getPropsFromCoordinates(props);
        }
        return props;
    }

    /**
     * Interface to the Shape's Draw mathod.
     * Draws the Shape on the canvas with the given coordinates in props
     * @param {Canvas} canvas 
     * @param {Object} props 
     */
    draw(canvas, props) {
        throw new Error("Choose the Shape!");
    }

    /**
     * TODO:
     * Add interface for a method to set line-width:
     * usage: context.lineWidth = 1;
     * refer to the Context-API: 
     * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth
     * 
     */
}

/**************************************************************************
 * Set of concrete classes below 
 * that each reperesents a perticular shape on a canvas.
 -------------------------------------------------------------------------*/
class Circle extends Shape {
    constructor() {
        super();
    }

    /**
     * Draws Circle with center at props{x, y} and radius props{r}
     * @param {Canvas} canvas Canvas object, where the shape must be drawn
     * @param {Object} props Object containing properties {x, y, r}
     */
    draw(canvas, props) {
        props = this.validateProps(props);
        canvas.context.strokeStyle = this.color;
        canvas.context.beginPath();
        canvas.context.arc(props.x, props.y, props.r, 0, 2*Math.PI);
        canvas.context.stroke();
        canvas.context.closePath();
    }

    /**
     * Shape specific method that returns object of properties required by shape to draw
     * out of two coordinates at the canvas: starting and ending points.
     * @param {Object} coordinates {start: {x, y}, end: {x, y}}
     */
    getPropsFromCoordinates(coordinates) {
        return {
            x:coordinates.start.x, 
            y:coordinates.start.y, 
            r:Math.sqrt(
                Math.pow(coordinates.end.x - coordinates.start.x, 2) + 
                Math.pow(coordinates.end.y - coordinates.start.y, 2)
            )};
    }
}

class Ellipse extends Shape {
    constructor() {
        super();
    }
    
    /**
     * Draws Ellipse
     * @param {Canvas} canvas 
     * @param {Object} props Object containing properties {x, y, rX, rY, rA}
     */
    draw(canvas, props) {
        props = this.validateProps(props);
        canvas.context.strokeStyle = this.color;
        canvas.context.beginPath();
        canvas.context.ellipse(props.x, props.y, props.rX, props.rY, props.rA, 0, 2*Math.PI);
        canvas.context.stroke();
        canvas.context.closePath();
    }

    /**
     * Shape specific method that returns object of properties required by shape to draw
     * out of two coordinates at the canvas: starting and ending points.
     * @param {Object} coordinates {start: {x, y}, end: {x, y}}
     */
    getPropsFromCoordinates(coordinates) {
        /**
         * TODO: rework this functio to make it calculating props more properly.
         */
        let hyp = Math.sqrt(
            Math.pow(coordinates.end.x - coordinates.start.x, 2) + 
            Math.pow(coordinates.end.y - coordinates.start.y, 2)
        );

        let adj = Math.abs(
            coordinates.end.y - coordinates.start.y
        );
        
        return {
            x: coordinates.start.x, 
            y: coordinates.start.y, 
            rX: Math.abs(coordinates.end.x - coordinates.start.x),
            rY: Math.abs(coordinates.end.y - coordinates.start.y),
            rA: Math.acos(adj/hyp)
        };
    }
}

class Rectangle extends Shape {
    constructor() {
        super();
    }

    /**
     * Draws Rectangle, with starting top-left coner at props{x, y}, width and height as props{w, h}
     * @param {Canvas} canvas Canvas object, where the shape must be drawn
     * @param {Object} props Object containing properties {x, y, w, h}
     */
    draw(canvas, props) {
        /**
         * TODO:
         * consider using context.strokeRect() instead.
         * refer fo Context-API:
         * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeRect
         */
        props = this.validateProps(props);
        canvas.context.strokeStyle = this.color;
        canvas.context.beginPath();
        canvas.context.moveTo(props.x, props.y);
        canvas.context.lineTo(props.x + props.w, props.y);
        canvas.context.lineTo(props.x + props.w, props.y + props.h);
        canvas.context.lineTo(props.x, props.y + props.h);
        canvas.context.lineTo(props.x, props.y);
        canvas.context.stroke();
        canvas.context.closePath();
    }

    /**
     * 
     * @param {Object} coordinates 
     */
    getPropsFromCoordinates(coordinates) {
        return {
            x:coordinates.start.x, 
            y:coordinates.start.y, 
            w:(coordinates.end.x - coordinates.start.x),
            h:(coordinates.end.y - coordinates.start.y)};
    }
}

/**
 * TODO: rename this class to Grid
 */
class Grid extends Shape {
    constructor() {
        super();
    }
    
    /**
     * Draws grid of coordiantes
     * @param {Canvas} canvas Canavas to draw at
     * @param {Object} props Reserved container for additiona params
     */
    draw(canvas, props) {
        let vwp = canvas.getViewPort();

        canvas.context.strokeStyle = this.color;
        canvas.context.lineWidth = 2.5;
        canvas.context.beginPath();
        canvas.context.moveTo(vwp.min.x, 0);
        canvas.context.lineTo(vwp.max.x, 0);
        canvas.context.moveTo(0, vwp.min.y);
        canvas.context.lineTo(0, vwp.max.y);
        canvas.context.stroke();
        canvas.context.closePath();

        canvas.context.strokeStyle = "rgb(200, 200, 230)";
        canvas.context.lineWidth = 0.05;
        canvas.context.beginPath();
        let step = 50;
        for (let x = step; x < vwp.max.x; x += step) {
            canvas.context.moveTo(x, vwp.min.y);
            canvas.context.lineTo(x, vwp.max.y);
            canvas.context.stroke();
            canvas.context.moveTo(-x, vwp.min.y);
            canvas.context.lineTo(-x, vwp.max.y);
            canvas.context.stroke();
        }

        for (let y = step; y < vwp.max.y; y += step) {
            canvas.context.moveTo(vwp.min.x, y);
            canvas.context.lineTo(vwp.max.x, y);
            canvas.context.stroke();
            canvas.context.moveTo(vwp.min.x, -y);
            canvas.context.lineTo(vwp.max.x, -y);
            canvas.context.stroke();
        }
        canvas.context.closePath();

    }
}

class Trace extends Shape {
    constructor() {
        super();
    }
    
    /**
     * Draws vertical and horizontal lines over the whole canvas,
     * crossed at position: props{x, y}
     * @param {Canvas} canvas Canvas object, where the shape must be drawn
     * @param {Object} props Object containing properties {x, y}
     */
    draw(canvas, props) {
        canvas.context.beginPath();
        canvas.context.strokeStyle = this.color;
        canvas.context.moveTo(props.x, 0);
        canvas.context.lineTo(props.x, canvas.view.height);
        canvas.context.moveTo(0, props.y);
        canvas.context.lineTo(canvas.view.width, props.y);
        canvas.context.stroke();
        canvas.context.closePath();
    }
}


class Graph extends Shape {
    constructor() {
        super();
    }

    draw(canvas, props) {
        let dots = new Array();
        let vwp = canvas.getViewPort();

        for (let x = vwp.min.x / canvas.getZoomFactor(); x <= vwp.max.x; x+=1) {
            if (
                this.f(x) > vwp.min.y / canvas.getZoomFactor() && 
                this.f(x) < vwp.max.y / canvas.getZoomFactor()
            ) {
                dots.push({
                    x: x, 
                    y: this.f(x)
                });
            }
        }
        

        canvas.context.beginPath();
        canvas.context.moveTo(dots[0].x, dots[0].y);
        for (let i=1; i < dots.length; i++) {
            canvas.context.lineTo(dots[i].x, dots[i].y);
        }
        canvas.context.stroke();
    }

    f(x) {
        
        // -- square function:
        // return  Math.pow(0.6 * x, 2); // (0.1 * x) * ( 0.1 * x)
        // return Math.pow(0.1 * x, 2) * 2 + 2 * x + 150;
        // return Math.pow(0.5 * x, 2) - 10;
        
        // -- cubic function:
        // return Math.pow(0.05 * x, 3);

        // -- sin/cose
        // return  10 * Math.sin(0.3 * x);
        // return  30 * Math.cos(0.05 * x);
        /**
         * TODO: fix a bug
         * this has a bug when being zoomed out.
         * graph is limitted on positive x values.
         */
        return  30 * Math.cos(x);
        
        
        // return -1.5 * x + 30;
        // return -x;
        // return x;
    }
}