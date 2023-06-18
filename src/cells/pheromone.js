import {DrawableCell} from "./drawableCell.js";
import {EmptyCell} from "./emptyCell.js";
import {getPheromoneFoodDepositRate} from "../globalVars.js";

export class Pheromone extends DrawableCell {

    constructor(x, y, cellSize) {
        super(x, y, cellSize);
        this.pheromoneLevel = getPheromoneFoodDepositRate();
        this.color = `rgba(197, 35, 35, 0)`;
    }


    draw(ctx) {
        new EmptyCell(this.x, this.y).draw(ctx);
        this.color = this.getColor(this.pheromoneLevel);
        super.draw(ctx);
    }

    getColor(pheromoneLevel) {
        let hue = 60 - pheromoneLevel * 3;
        return `hsl(${hue}, 100%, 50%, ${Math.min(1, this.pheromoneLevel)})`;
    }
}