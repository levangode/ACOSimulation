export class City {

    constructor(x, y, cellSize, context) {
        this.color = '#20ef09';

        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.context = context;
    }

    draw() {
        this.context.beginPath();
        this.context.arc(this.x * this.cellSize + this.cellSize / 2, this.y * this.cellSize + this.cellSize / 2, 14, 0, 2 * Math.PI);
        this.context.fillStyle = this.color;
        this.context.fill();
        this.context.lineWidth = 2;
        this.context.stroke();
        this.context.lineWidth = 1;
        this.context.closePath();
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y
        }
    }

}