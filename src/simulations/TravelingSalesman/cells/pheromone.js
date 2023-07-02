export class Pheromone {

    constructor(x, y, cellSize, edge) {
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.edge = edge;
        this.color = `rgb(255, 0, 0)`;
    }

    draw(ctx){
        ctx.fillStyle = this.color;
        //ctx.fillRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
        let prevColor = ctx.strokeStyle;
        this.color = this.getColor();
        ctx.strokeStyle = this.color;
        ctx.strokeRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
        ctx.strokeStyle = prevColor;
    }

    getColor() {
        let hue = 60 - this.edge.pheromoneAmount * 3;
        return `hsl(${hue}, 100%, 50%, ${Math.min(1, this.edge.pheromoneAmount)})`;
    }
}