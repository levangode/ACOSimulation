export class Ant {

    constructor(x, y, cellSize) {
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.color = 'rgb(255,0,0)'
    }


    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x * this.cellSize + this.cellSize / 2, this.y * this.cellSize + this.cellSize / 2, 5, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}