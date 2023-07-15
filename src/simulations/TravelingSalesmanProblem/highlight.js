export class Highlight {

    constructor(x, y, cellSize, context) {
        this.color = 'rgb(255,0,0)';

        this.x = x;
        this.y = y
        this.cellSize = cellSize;
        this.context = context;
    }

    draw() {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
        this.context.strokeRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
    }
}