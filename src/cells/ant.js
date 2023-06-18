import {DrawableCell} from "./drawableCell.js";
import {Pheromone} from "./pheromone.js";
import {EmptyCell} from "./emptyCell.js";
import {getGameState} from "../globalVars.js";

export class Ant extends DrawableCell {
    //TODO: add homepoint
    //TODO: add heuristic
    constructor(x, y, cellSize) {
        super(x, y, cellSize);
        this.color = '#25a996';
        this.trail = [];
        this.memory = [];
        this.memorySize = 10;
        this.searching = true;
    }

    moving(grid) {
        //setInterval(() => {
        if (this.searching) {
            this.looking(grid);
        } else {
            this.goingBack(grid);
        }
        //}, 60)

        //requestAnimationFrame(() => this.move(grid));
    }

    looking(grid) {
        this.trail.forEach(trailCell => trailCell.draw(grid.context));

        let nextCell = this.getMove(grid);
        if(!nextCell) return;
        this.move(grid, nextCell);

        if (grid.getCellAt(this.x, this.y) === "Food") {
            grid.addCell(new EmptyCell(this.x, this.y));
            this.searching = false;
        }

        this.draw(grid.context);
    }

    move(grid, nextCell) {
        grid.moveAnt(this, nextCell.x - this.x, nextCell.y - this.y);
        this.updateMemory(nextCell);
    }

    updateMemory(nextCell) {
        this.memory.push(this.getCoordinateKey(nextCell.x, nextCell.y));
        if (this.memory.length > this.memorySize) {
            this.memory.shift();
        }
    }

    getCoordinateKey(x, y) {
        return `${x},${y}`;
    }

    getMove(grid) {
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

        let alpha = 5;
        let total = 0;
        nextCells.forEach(cell => {
            cell.probability = Math.pow(1 + grid.getPheromoneLevel(cell.x, cell.y), alpha);
            total += cell.probability;
        });

        nextCells.forEach(cell => cell.probability /= total);
        if(nextCells.length === 0){
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


    getMoveProbability(grid, x, y) {
        const alpha = 1;
        const beta = 1;
        const pheromone = 1;
        const distance = 1;
        const theta = 1 / distance;
        let pNextState;
    }

    attractiveness(tau, theta, alpha, beta) {
        return (tau ** alpha) * (theta ** beta);
    }

    goingBack(grid) {

        if (this.x === grid.cols / 2 && this.y === grid.rows / 2) {
            this.searching = true;
        }
        let dx = Math.sign(grid.cols / 2 - this.x);
        let dy = Math.sign(grid.rows / 2 - this.y);
        grid.addTrail(new Pheromone(this.x, this.y));
        grid.moveAnt(this, dx, dy);

    }
}