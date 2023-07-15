export class CellWrapper {

    constructor(drawableCell, context) {
        this.context = context;

        this.drawables = new Map();
        this.layers = new Map();
        this.layers.set(1, "EmptyCell");
        this.layers.set(2, "Road");
        this.layers.set(3, "Pheromone");
        this.layers.set(4, "Highlight");
        this.layers.set(5, "City");
        this.layers.set(6, "Ant");
        this.drawables.set(drawableCell.constructor.name, drawableCell);
    }


    add(drawableCell) {
        this.drawables.set(drawableCell.constructor.name, drawableCell);
    }

    remove(drawableCell) {
        if (this.drawables.has(drawableCell.constructor.name)) {
            this.drawables.delete(drawableCell.constructor.name);
        }
    }

    drawLayer(layer) {
        if (this.drawables.has(this.layers.get(layer))) {
            this.drawables.get(this.layers.get(layer)).draw(this.context);
        }
    }

    draw() {
        for (let i = 1; i <= this.layers.size; i++) {
            if (this.drawables.has(this.layers.get(i))) {
                this.drawables.get(this.layers.get(i)).draw(this.context);
            }
        }
    }
}