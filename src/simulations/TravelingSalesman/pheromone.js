export class Pheromone {

    constructor(x, y, cellSize, edge, config) {
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.edge = edge;
        this.color = `rgb(255, 0, 0)`;

        this.config = config;
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

    getColor() {    //-90; 60
        let maxDepositEachTime = this.config.pheromoneDepositFactor / (this.config.averageDistance * this.config.numCities) * this.config.numAnts - this.config.evaporationRate;
        let maxDepositAmount = maxDepositEachTime * this.config.maxIterations;
        let factor = 150 / maxDepositAmount;
        //0 - 150
        //0 - maxPheromoneAmount
        let progress = Math.max(0, this.edge.pheromoneAmount - this.config.initialPheromoneLevels) * factor;
        let hue = (60 - progress) % 360;
        let opacity = Math.max(Math.min(this.edge.pheromoneAmount / this.config.initialPheromoneLevels, 1), 0);
        return `hsl(${hue}, 100%, 50%, ${opacity})`;
    }
}