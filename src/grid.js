import {EmptyCell} from "./cells/emptyCell.js";
import {cellSize} from "./globalVars.js";
import {Food} from "./cells/food.js";


export class Grid {
    constructor(numRows, numCols, context) {
        this.rows = numRows;
        this.cols = numCols;
        this.grid = Array.from({length: this.cols}).map(() => new Array(this.rows));
        this.pheromonesGrid = Array.from({length: this.cols}).map(() => new Array(this.rows));
        this.pheromones = [];
        this.context = context;
    }

    evaporate() {
        for(let i = 0; i<this.pheromones.length; i++){
            let pheromone = this.pheromones[i];
            pheromone.opacity -= pheromone.decayRate;
            if(pheromone.opacity <= 0){
                this.pheromones.splice(i,1);
                this.pheromonesGrid[pheromone.x][pheromone.y] = NaN;
            } else {
                if (["EmptyCell", "Trail", "Food"].includes(this.getCellAt(pheromone.x, pheromone.y))) {
                    pheromone.draw(this.context);
                }
            }
        }

    }

    init() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.grid[i][j] = new EmptyCell(i, j, cellSize);
            }
        }

        setInterval(() => {
            this.evaporate();
        }, 200)
    }


    draw() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.grid[i][j].draw(this.context);
            }
        }
    }

    addTrail(pheromone) {
        if (this.pheromonesGrid[pheromone.x][pheromone.y]) {
            this.pheromonesGrid[pheromone.x][pheromone.y].opacity += 1;
        } else {
            this.pheromones.push(pheromone);
            this.pheromonesGrid[pheromone.x][pheromone.y] = pheromone;
        }
    }

    moveAnt(ant, dx, dy){
        if(this.pheromonesGrid[ant.x][ant.y]){
            this.pheromonesGrid[ant.x][ant.y].draw(this.context);
        } else {
            this.addCell(new EmptyCell(ant.x, ant.y));
        }

        ant.x = Math.min(Math.max(ant.x + dx, 0), this.cols - 1);
        ant.y = Math.min(Math.max(ant.y + dy, 0), this.rows - 1);
        ant.draw(this.context);
    }
    addCell(obj) {
        this.grid[obj.x][obj.y] = obj;
        obj.draw(this.context);
    }

    getCellAt(x, y) {
        return this.grid[x][y].constructor.name;
    }
}