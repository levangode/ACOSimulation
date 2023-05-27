import {DrawableCell} from "./drawableCell.js";

export class EmptyCell extends DrawableCell {

    constructor(x, y) {
        super(x, y);
        this.color = '#383535'
    }

    draw(ctx) {
        super.clear(ctx);
        super.draw(ctx);
    }
}