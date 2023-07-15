export class Pheromone {

    constructor(x, y, cellSize, context, edge, config) {
        this.color = `rgb(255, 0, 0)`;

        this.x = x;
        this.y = y;
        this.cellSize = cellSize;

        this.context = context;

        this.config = config;
        this.edge = edge;
    }

    draw(){
        this.context.fillStyle = this.color;
        let prevColor = this.context.strokeStyle;
        this.color = this.getColor();
        this.context.strokeStyle = this.color;
        this.context.lineWidth = 2;
        this.context.strokeRect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);
        this.context.strokeStyle = prevColor;
    }

    getColor() {
        let maxDepositEachTime = (this.config.pheromoneDepositFactor / this.config.averageDistance / 4)  * this.config.numAnts - this.config.evaporationRate;
        let maxDepositAmount = maxDepositEachTime * this.config.maxIterations;
        let factor = 150 / maxDepositAmount;
        let progress = Math.max(0, this.edge.pheromoneAmount - this.config.initialPheromoneLevels) * factor;
        let hue = (50 - progress) % 360;
        let opacity = Math.max(Math.min(this.edge.pheromoneAmount / this.config.initialPheromoneLevels, 1), 0);
        return `hsl(${hue}, 100%, 50%, ${opacity})`;
    }
}