import {EmptyCell} from "./cells/emptyCell.js";


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