export class AntColonyConfig {

    constructor() {
        this.cellSize = 5;
        this.numAnts = 30;
        this.islandSize = 4;
        this.numIslands = 20;

        this.gameState = 'paused';
        this.evaporationRate = 0.001;
        this.alpha = 5;
        this.antMemorySize = 5;
        this.pheromoneFoodDepositRate = 1;
    }
}