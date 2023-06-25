import {EmptyCell} from "./cells/emptyCell.js";
import {Food} from "./cells/food.js";


export class Grid {
    constructor(numRows, numCols, context, config) {
        this.rows = numRows;
        this.cols = numCols;
        this.grid = Array.from({length: this.cols}).map(() => new Array(this.rows));
        this.pheromonesGrid = Array.from({length: this.cols}).map(() => new Array(this.rows));
        this.pheromones = [];
        this.context = context;
        this.config = config;
    }

    evaporate() {
        for(let i = 0; i<this.pheromones.length; i++){
            let pheromone = this.pheromones[i];
            pheromone.pheromoneLevel -= this.config.evaporationRate;
            if(pheromone.pheromoneLevel <= 0){
                this.pheromones.splice(i,1);
                this.pheromonesGrid[pheromone.x][pheromone.y] = NaN;
                this.addCell(new EmptyCell(pheromone.x, pheromone.y, this.config.cellSize));
            } else {
                if (["EmptyCell", "Pheromone", "Food"].includes(this.getCellAt(pheromone.x, pheromone.y))) {
                    pheromone.draw(this.context);
                }
            }
        }

    }

    init() {
        this.grid = Array.from({length: this.cols}).map(() => new Array(this.rows));
        this.pheromonesGrid = Array.from({length: this.cols}).map(() => new Array(this.rows));
        this.pheromones = [];

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.grid[i][j] = new EmptyCell(i, j, this.config.cellSize);
            }
        }
    }


    draw() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.grid[i][j].draw(this.context);
            }
        }
    }

    addPheromone(pheromone) {
        if (this.pheromonesGrid[pheromone.x][pheromone.y]) {
            if(this.pheromonesGrid[pheromone.x][pheromone.y].pheromoneLevel <= 45) {
                this.pheromonesGrid[pheromone.x][pheromone.y].pheromoneLevel += 1;
            }
        } else {
            this.pheromones.push(pheromone);
            this.pheromonesGrid[pheromone.x][pheromone.y] = pheromone;
        }
    }

    moveAnt(ant, dx, dy){
        if(this.pheromonesGrid[ant.x][ant.y]){
            this.pheromonesGrid[ant.x][ant.y].draw(this.context);
        } else {
            this.addCell(new EmptyCell(ant.x, ant.y, this.config.cellSize));
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

    getPheromoneLevel(x, y){
        return this.pheromonesGrid[x][y]?.pheromoneLevel ?? 0;
    }
}