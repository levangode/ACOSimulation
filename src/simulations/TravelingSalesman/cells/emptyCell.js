

export class EmptyCell {

    constructor(x, y, cellSize) {
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.color = '#383535'
    }

    draw(ctx) {
        ctx.clearRect(this.x * this.cellSize - ctx.lineWidth / 2, this.y * this.cellSize - ctx.lineWidth / 2, this.cellSize + ctx.lineWidth, this.cellSize + ctx.lineWidth);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
        ctx.strokeRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
    }
}