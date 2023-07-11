export class Highlight {

    constructor(x, y, cellSize) {
        this.x = x;
        this.y = y
        this.cellSize = cellSize;
        this.color = 'rgb(255,0,0)';
    }

    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
        ctx.strokeRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
    }
}