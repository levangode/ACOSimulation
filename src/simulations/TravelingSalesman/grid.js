import {EmptyCell} from "./cells/emptyCell.js";
import {CellWrapper} from "./cells/cellWrapper.js";


export class Grid {
    constructor(numRows, numCols, context, config) {
        this.rows = numRows;
        this.cols = numCols;
        this.grid = Array.from({length: this.cols}).map(() => new Array(this.rows));
        this.context = context;
        this.config = config;
    }


    init() {
        this.grid = Array.from({length: this.cols}).map(() => new Array(this.rows));
        this.context.clearRect(0, 0, this.cols * this.config.cellSize, this.rows * this.config.cellSize);
        this.redraw();
    }


    redraw(){
        for(let layer = 1; layer <=5; layer++){
            for (let i = 0; i < this.cols; i++) {
                for (let j = 0; j < this.rows; j++) {
                    if(this.grid[i][j]) {
                        this.grid[i][j].drawLayer(layer, this.context);
                    }
                }
            }
        }
    }

    addCell(obj) {
        if(!this.grid[obj.x][obj.y]){
            this.grid[obj.x][obj.y] = new CellWrapper(obj);
        } else {
            this.grid[obj.x][obj.y].add(obj);
        }
        this.grid[obj.x][obj.y].draw(this.context);
    }

    getCellNameAt(x, y) {
        return this.grid[x][y].constructor.name;
    }

    getCellAt(x, y) {
        return this.grid[x][y];
    }

    getPheromoneLevel(x, y){
        return this.pheromonesGrid[x][y]?.pheromoneLevel ?? 0;
    }
}