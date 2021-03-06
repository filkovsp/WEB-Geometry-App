/**
 * Dipatcher class watches the mouse events and "decides" what action must be perfomed based on the event:
 * - move event: 
 *      if we just move mouse over the canvas, we trace its move in "tracing" layer. look into trace() method
 * - click event:
 *      if we make a click: 1st click starts modelling the chosen shape into "model" layer.
 *      by second click we set the shape as complete and draw the same shape with final props 
 *      into the "main" layer and clear out the "model" layer.
 */
class Dispatcher {
    constructor(stage) {
        this.stage = stage;
        this.tracer = new Trace();
        this.grid = new Grid()
        this.init();
    }

    /**
     * This is an internal method, not supposed to be called from outside, for now.
     */
    init() {
        // Set initial values for the coordinates:
        this.x = 0; 
        this.y = 0;
        this.start = {x: 0, y:0};
        this.end = {x: 0, y: 0};
        this.clickCount = 0;
        
        // Set tracing line color to red-ish.
        this.tracer.setColor("rgb(150, 0, 0)");
        this.grid.setColor("rgb(81, 171, 255)");
        this.stage.model.draw(this.grid, {});
    }

    /**
     * This is the only method that should be used from outside, by the client of this class.
     * The rest of methods in Dispatcher are for internal use only.
     * @param {Object} event 
     * @param {Object} shape 
     */
    dispatch(event, shape) {
        this.x = event.clientX - event.target.parentElement.offsetLeft;
        this.y = event.clientY - event.target.parentElement.offsetTop;
        this.trace(event);

        /**
         * TODO:
         * implement keypress event handler, for ESC key to cancel shape modelling. https://api.jquery.com/keypress/
         * implement the logic below with Observer pattern.
         */
        if (event.type == "click" && shape.constructor.name == "Shape") {
            alert("Pick a Shape from the tool bar!");
        } else if (event.type == "click") {        
            this.stage.model.draw(this.grid, {});
            this.stage.main.draw(shape, {});
        } 
        else if (["mousewheel", "scroll"].some(e => (e == event.type))) {
            
            // Zoom in/out with mouse-wheel:
            this.stage.main.clear();

            if (event.deltaY > 0) {
                $("input[name='zoom']").val(this.stage.main.zoomIn());
            } else {
                $("input[name='zoom']").val(this.stage.main.zoomOut());
            }
            
            this.stage.main.draw(shape, {});
        }
        
        // Optional return. Just to let the client know that method has worked fine.
        return true;
    }
    
    /**
     * trace() - it an internal method, not supposed to be called from outside, for now.
     * @param {Object} event Mouse Event object (optional)
     */
    trace(event) {
        let offsetX = Math.round(this.stage.trace.view.width/2);
        let offsetY = Math.round(this.stage.trace.view.height/2);
        
        $("input[name='x']").val(this.x - offsetX);
        $("input[name='y']").val(offsetY - this.y);
        this.stage.trace.clear();
        this.stage.trace.draw(this.tracer, {x: this.x, y: this.y});
        
        // Optional return. Just to let the client know that method has worked fine.
        return true;
    }
}