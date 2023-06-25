import {EmptyCell} from "./emptyCell.js";

export class Pheromone {

    constructor(x, y, cellSize, config) {
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.config = config;
        this.pheromoneLevel = this.config.pheromoneFoodDepositRate;
        this.color = `rgba(197, 35, 35, 0)`;
    }


    draw(ctx) {
        new EmptyCell(this.x, this.y, this.cellSize).draw(ctx);
        this.color = this.getColor(this.pheromoneLevel);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
        ctx.strokeRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
    }

    getColor(pheromoneLevel) {
        let hue = 60 - pheromoneLevel * 3;
        return `hsl(${hue}, 100%, 50%, ${Math.min(1, this.pheromoneLevel)})`;
    }
}