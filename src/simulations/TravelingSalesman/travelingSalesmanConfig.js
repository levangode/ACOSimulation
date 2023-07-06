export class TravelingSalesmanConfig {

    constructor() {
        this.cellSize = 5;
        this.numCities = 10;

        this.alpha = 1;
        this.beta = 1;
        this.numAnts = 10;
        this.evaporationRate = 0.000005;
        this.pheromoneDepositFactor = 0.001;
        this.maxIterations = 100;
        this.initialPheromoneLevels = 0.001;

        this.showEdgeSelection = false;
        this.showEdgeMovement = false;
        this.showPheromoneUpdate = false;

        this.averageDistance = 0;
        this.gameState = 'setup';
    }
}