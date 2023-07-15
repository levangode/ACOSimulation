export class Food {

    constructor(x, y, cellSize, context) {
        this.color = '#20ef09'

        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.context = context;
    }

    draw() {
        this.context.clearRect(this.x * this.cellSize - this.context.lineWidth, this.y * this.cellSize - this.context.lineWidth, this.cellSize + this.context.lineWidth * 2, this.cellSize + this.context.lineWidth * 2);
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
        this.context.strokeRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
    }
}