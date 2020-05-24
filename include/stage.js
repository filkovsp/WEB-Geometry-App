/**
 * Stage class is just a container for three layers of the Drawing scene.
 * The layers are:
 *   - main layer - this is the pace where the finale drawing comes to
 *   - model layer - temporary place, where we see a shape while we construct it.
 *     after necessary shape is chosen and 1st clict at the drawing canvas made, 
 *     we start "modelling" our shape. we drug mouse over the canvase, watch the sape changing its size, 
 *     and choose the size we want to give for the shape.
 *   - trace layer - decorating layer, just to make fancy cross horizontal and vertical lines, crossing at the mouse pointer.
 */
class Stage {
    constructor(main, model, trace) {
        this.main = new Canvas(main);
        this.model = new Canvas(model);
        this.trace = new Canvas(trace);
        this.init();
    }

    init() {
        // tracing and modelling layers must be semi-tranparent:
        this.trace.context.globalAlpha = 0.3;
        this.model.context.globalAlpha = 0.7;
          
        // Decorate line styles for tarcing and modelling layers:
        this.trace.context.setLineDash([1, 3]);
        this.model.context.setLineDash([1, 1]);
        
        // translate context to center of canvas
        this.main.context.translate(this.trace.view.width/2, this.trace.view.height/2);

        // flip vertically:
        this.main.setScale(1, -1);
    
    }

    clear() {
        let props = {
            x: -this.trace.view.width/2,
            y: -this.trace.view.height/2,
            w: this.trace.view.width,
            h: this.trace.view.height
        };
        
        this.main.clear(props);
        this.main.context.resetTransform();
        
        this.model.clear();
        this.trace.clear();
        
        this.init();
    }
}