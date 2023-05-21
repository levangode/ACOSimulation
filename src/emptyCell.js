import {DrawableCell} from "./drawableCell.js";

export class EmptyCell extends DrawableCell {

    constructor(x, y, cellSize) {
        super(x, y, cellSize);
        this.color = '#FFFFFF'
    }
}