import {EmptyCell} from "./emptyCell.js";

export class Pheromone {

    constructor(x, y, cellSize, context, config) {
        this.color = `rgba(197, 35, 35, 0)`;

        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.context = context;

        this.config = config;
        this.pheromoneLevel = this.config.pheromoneFoodDepositRate;
    }


    draw() {
        new EmptyCell(this.x, this.y, this.cellSize, this.context).draw();
        this.color = this.getColor(this.pheromoneLevel);
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
        this.context.strokeRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
    }

    getColor(pheromoneLevel) {
        let hue = 60 - pheromoneLevel * 3;
        return `hsl(${hue}, 100%, 50%, ${Math.min(1, this.pheromoneLevel)})`;//test
    }
}