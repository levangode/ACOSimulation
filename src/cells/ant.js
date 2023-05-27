import {DrawableCell} from "./drawableCell.js";
import {Trail} from "./trail.js";
import {EmptyCell} from "./emptyCell.js";
import {getGameState} from "../globalVars.js";

export class Ant extends DrawableCell {
    //TODO: add homepoint
    //TODO: add heuristic
    constructor(x, y, cellSize) {
        super(x, y, cellSize);
        this.color = '#ff0000';
        this.trail = [];
        this.searching = true;
    }

    move(grid) {
        setInterval(() => {
            if(getGameState() === 'playing')
            if (this.searching) {
                this.looking(grid);
            } else {
                this.goingBack(grid);
            }
        }, 60)

        //requestAnimationFrame(() => this.move(grid));
    }

    looking(grid) {
        this.trail.forEach(trailCell => trailCell.draw(grid.context));

        let dx, dy;
        do {
            dx = Math.floor(Math.random() * 3) - 1;
            dy = Math.floor(Math.random() * 3) - 1;
        } while (dx === 0 && dy === 0);

        grid.moveAnt(this, dx, dy);

        if (grid.getCellAt(this.x, this.y) === "Food") {
            grid.addCell(new EmptyCell(this.x, this.y));
            this.searching = false;
        }

        this.draw(grid.context);
    }

    changeState(grid, x, y) {
        grid.moveAnt(x, y);
        this.x = x;
        this.y = y;
        this.draw(grid.context);
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


        let dx = Math.sign(grid.cols / 2 - this.x);
        let dy = Math.sign(grid.rows / 2 - this.y);
        grid.addTrail(new Trail(this.x, this.y));
        grid.moveAnt(this, dx, dy);
        if(this.x === grid.cols / 2 && this.y === grid.rows / 2){
            this.searching = true;
        }
    }
}