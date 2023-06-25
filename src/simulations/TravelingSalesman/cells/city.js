export class City {

    constructor(x, y, cellSize, config) {
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.color = '#20ef09';
        this.config = config;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x * this.cellSize + this.cellSize / 2, this.y * this.cellSize + this.cellSize / 2, 15, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }


}