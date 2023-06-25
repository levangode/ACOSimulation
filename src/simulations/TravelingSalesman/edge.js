export class Edge {

    constructor(from, to, distance, cellSize) {
        this.from = from;
        this.to = to;
        this.distance = distance;
        this.cellSize = cellSize;
    }

    draw(ctx) {
        let x = this.from.x;
        let y = this.from.y;

        while (x !== this.to.x || y !== this.to.y) {
            let dx = Math.sign(this.to.x - x);
            let dy = Math.sign(this.to.y - y);

            x = x + dx;
            y = y + dy;
            if(x !== this.to.x || y !== this.to.y) {
                ctx.fillStyle = 'rgb(37,169,150)';
                ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
            }
        }

    }
}