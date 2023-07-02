export class CellWrapper {

    constructor(drawableCell) {
        this.drawables = new Map();
        this.layers = new Map();
        this.layers.set(1, "EmptyCell");
        this.layers.set(2, "City");
        this.layers.set(3, "Road");
        this.layers.set(4, "Pheromone");
        this.layers.set(5, "Ant");
        this.drawables.set(drawableCell.constructor.name, drawableCell);
    }


    add(drawableCell) {
        if (this.drawables.has(drawableCell.constructor.name)) {
            if (drawableCell.constructor.name === "Pheromone") {

            }
        }
        this.drawables.set(drawableCell.constructor.name, drawableCell);
    }

    drawLayer(layer, ctx){
        if (this.drawables.has(this.layers.get(layer))) {
            this.drawables.get(this.layers.get(layer)).draw(ctx);
        }
    }

    draw(ctx) {
        for (let i = 1; i <= this.layers.size; i++) {
            if (this.drawables.has(this.layers.get(i))) {
                this.drawables.get(this.layers.get(i)).draw(ctx);
            }
        }
    }
}