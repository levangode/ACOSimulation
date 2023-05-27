import {Drawable} from "../drawable.js";
import {cellSize} from "../globalVars.js";

export class DrawableCell extends Drawable {

    constructor(x, y) {
        super(x, y);
        this.size = cellSize;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
        ctx.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
    }


    clear(ctx) {
        ctx.clearRect(this.x * this.size, this.y * this.size, this.size, this.size);
    }
}