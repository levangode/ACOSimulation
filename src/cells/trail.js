import {DrawableCell} from "./drawableCell.js";
import {EmptyCell} from "./emptyCell.js";

export class Trail extends DrawableCell {

    constructor(x, y, cellSize) {
        super(x, y, cellSize);
        this.decayRate = 0.01;
        this.opacity = 1;
        this.color = `rgba(197, 35, 35, 0)`;
    }


    draw(ctx) {
        new EmptyCell(this.x, this.y).draw(ctx);
        this.color = `rgba(37,169,150, ${this.opacity})`;
        super.draw(ctx);
    }
}