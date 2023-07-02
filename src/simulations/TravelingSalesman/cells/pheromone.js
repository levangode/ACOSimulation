export class Pheromone {

    constructor(x, y, cellSize, pheromoneLevel) {
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.pheromoneLevel = pheromoneLevel;
        this.color = 'rgb(239,209,58)';
    }

    draw(ctx){
        ctx.fillStyle = this.color;
        //ctx.fillRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
        let prevColor = ctx.strokeStyle;
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
        ctx.strokeStyle = prevColor;
    }
}