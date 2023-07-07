export class TravelingSalesmanConfig {

    constructor() {
        this.cellSize = 5;
        this.numCities = 10;
        this.minimumPheromoneAmount = 0.000000001;

        this.alpha = 1;
        this.beta = 1;
        this.numAnts = 10;
        this.evaporationRate = 0.00005;
        this.pheromoneDepositFactor = 0.02;
        this.maxIterations = 100;
        this.initialPheromoneLevels = 0.001;
        this.iterationDelay = 60;

        this.showEdgeSelection = false;
        this.showEdgeMovement = false;

        this.averageDistance = 0;
        this.gameState = 'setup';
        this.preset = 'Random';
    }
}