import {DrawableCell} from "./drawableCell.js";

export class Food extends DrawableCell {

    constructor(x, y, cellSize) {
        super(x, y, cellSize);
        this.color = '#20ef09'
    }
}