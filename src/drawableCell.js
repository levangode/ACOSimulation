import {Drawable} from "./drawable.js";

export class DrawableCell extends Drawable {

    constructor(x, y, cellSize) {
        super(x, y);
        this.size = cellSize;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
        ctx.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
    }
}