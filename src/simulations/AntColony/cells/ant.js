import {Pheromone} from "./pheromone.js";
import {EmptyCell} from "./emptyCell.js";

export class Ant  {
    constructor(x, y, cellSize, config) {
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.color = '#25a996';
        this.memory = [];
        this.searching = true;
        this.config = config;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
        ctx.strokeRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
    }

    moving(grid) {

        if (grid.getCellAt(this.x, this.y) === "Food") {
            grid.addCell(new EmptyCell(this.x, this.y, this.cellSize));
            this.searching = false;
        }
        let nextCell;
        if (this.searching) {
            nextCell = this.getNextCell(grid);
        } else {
            nextCell = this.getNextCellHome(grid);
        }
        if (!nextCell) return;
        this.move(grid, nextCell, !this.searching);

        if (this.isHomePoint(grid)) {
            this.searching = true;
        }

    }

    isHomePoint(grid) {
        return this.x === grid.cols / 2 && this.y === grid.rows / 2;
    }


    getNextCellHome(grid) {

        let dx = Math.sign(grid.cols / 2 - this.x);
        let dy = Math.sign(grid.rows / 2 - this.y);

        return {x: this.x + dx, y: this.y + dy};
    }

    move(grid, nextCell, addPheromone) {
        if (addPheromone) {
            grid.addPheromone(new Pheromone(this.x, this.y, this.cellSize, this.config));
        }
        grid.moveAnt(this, nextCell.x - this.x, nextCell.y - this.y);
        if (addPheromone && this.isHomePoint(grid)) {
            grid.addPheromone(new Pheromone(this.x, this.y, this.cellSize, this.config));
        }
        this.updateMemory(nextCell);
    }

    updateMemory(nextCell) {
        this.memory.push(this.getCoordinateKey(nextCell.x, nextCell.y));
        if (this.memory.length > this.config.antMemorySize) {
            this.memory.shift();
        }
    }

    getCoordinateKey(x, y) {
        return `${x},${y}`;
    }


    getNextCell(grid) {
        let nextCells = [
            {x: this.x - 1, y: this.y}, //left
            {x: this.x + 1, y: this.y}, //right
            {x: this.x, y: this.y - 1}, //up
            {x: this.x, y: this.y + 1}, //down

            {x: this.x - 1, y: this.y - 1}, //left-up
            {x: this.x - 1, y: this.y + 1}, //left-down
            {x: this.x + 1, y: this.y - 1}, //right-up
            {x: this.x + 1, y: this.y + 1}, //right-down
        ];

        nextCells = nextCells
            .filter(cell => cell.x >= 0 && cell.y >= 0 && cell.x < grid.cols && cell.y < grid.rows)
            .filter(cell => !this.memory.includes(this.getCoordinateKey(cell.x, cell.y)));

        let total = 0;
        nextCells.forEach(cell => {
            cell.probability = Math.pow(1 + grid.getPheromoneLevel(cell.x, cell.y), this.config.alpha);
            total += cell.probability;
        });

        nextCells.forEach(cell => cell.probability /= total);
        if (nextCells.length === 0) {
            this.memory = [];
            return;
        }

        //choose cell
        let r = Math.random();
        let index = 0;
        let sum = nextCells[0].probability;
        while (r > sum && index < nextCells.length - 1) {
            index++;
            sum += nextCells[index].probability;
        }
        return nextCells[index];

    }
}