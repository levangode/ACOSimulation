import {TravelingSalesmanConfig} from "./travelingSalesmanConfig.js";
import {Grid} from "./grid.js";
import {City} from "./city.js";
import {Edge} from "./edge.js";
import {Ant} from "./ant.js";
import {Road} from "./road.js";
import {Pheromone} from "./pheromone.js";
import {cityPresets} from "./presets.js";


export class TravelingSalesman {

    constructor() {
        this.config = new TravelingSalesmanConfig();
        this.canvas = document.getElementById('tCanvas');
        this.context = this.canvas.getContext('2d');

        this.rows = this.canvas.height / this.config.cellSize;
        this.cols = this.canvas.width / this.config.cellSize;
        this.numAnts = this.config.numAnts;

        this.setupControlPanel();
        this.init();

    }

    async startGame() {
        if(this.config.gameState === 'setup') {
            this.config.gameState = 'playing';
            await this.runSimulation();
        } else {
            this.config.gameState = 'playing';
        }
    }

    pauseGame(){
        this.config.gameState = 'paused';
    }

    drawTour(tour) {
        this.grid.init();
        for (let i = 0; i < tour.length - 1; i++) {
            this.createEdge(tour[i], tour[i + 1]);
        }
        this.cities.forEach(city => this.grid.addCell(city));
    }

    setupControlPanel() {
        document.getElementById("tspAlpha").value = this.config.alpha;
        document.getElementById("tspAlphaValue").innerHTML = this.config.alpha
        document.getElementById("tspAlpha").addEventListener('input', (e) => {
            let value = e.target.value;
            document.getElementById("tspAlphaValue").innerHTML = value;
            this.config.alpha = value;
        });


        document.getElementById("tspBeta").value = this.config.beta;
        document.getElementById("tspBetaValue").innerHTML = this.config.beta
        document.getElementById("tspBeta").addEventListener('input', (e) => {
            let value = e.target.value;
            document.getElementById("tspBetaValue").innerHTML = value;
            this.config.beta = value;
        });

        document.getElementById("tspNumberOfAnts").value = this.config.numAnts;
        document.getElementById("tspNumberOfAntsValue").innerHTML = this.config.numAnts
        document.getElementById("tspNumberOfAnts").addEventListener('input', (e) => {
            let value = e.target.value;
            document.getElementById("tspNumberOfAntsValue").innerHTML = value;
            this.config.numAnts = value;
        });

        document.getElementById("tspEvaporationRate").value = this.config.evaporationRate;
        document.getElementById("tspEvaporationRateValue").innerHTML = this.config.evaporationRate
        document.getElementById("tspEvaporationRate").addEventListener('input', (e) => {
            let value = e.target.value;
            document.getElementById("tspEvaporationRateValue").innerHTML = value;
            this.config.evaporationRate = value;
        });

        document.getElementById("tspEvaporationRate").value = this.config.evaporationRate;
        document.getElementById("tspEvaporationRateValue").innerHTML = this.config.evaporationRate
        document.getElementById("tspEvaporationRate").addEventListener('input', (e) => {
            let value = e.target.value;
            document.getElementById("tspEvaporationRateValue").innerHTML = value;
            this.config.evaporationRate = value;
        });

        document.getElementById("tspPheromoneDepositFactor").value = this.config.pheromoneDepositFactor;
        document.getElementById("tspPheromoneDepositFactorValue").innerHTML = this.config.pheromoneDepositFactor
        document.getElementById("tspPheromoneDepositFactor").addEventListener('input', (e) => {
            let value = e.target.value;
            document.getElementById("tspPheromoneDepositFactor").innerHTML = value;
            this.config.pheromoneDepositFactor = value;
        });

        document.getElementById("tspMaxIterations").value = this.config.maxIterations;
        document.getElementById("tspMaxIterationsValue").innerHTML = this.config.maxIterations
        document.getElementById("tspMaxIterations").addEventListener('input', (e) => {
            let value = e.target.value;
            document.getElementById("tspMaxIterationsValue").innerHTML = value;
            this.config.maxIterations = value;
        });

        document.getElementById("tspInitialPheromoneLevels").value = this.config.initialPheromoneLevels;
        document.getElementById("tspInitialPheromoneLevelsValue").innerHTML = this.config.initialPheromoneLevels
        document.getElementById("tspInitialPheromoneLevels").addEventListener('input', (e) => {
            let value = e.target.value;
            document.getElementById("tspInitialPheromoneLevelsValue").innerHTML = value;
            this.config.initialPheromoneLevels = value;
        });

        document.getElementById("edgeSelection").addEventListener('input', (e) => {
            this.config.showEdgeSelection = e.target.checked;
        });

        document.getElementById("edgeMovement").addEventListener('input', (e) => {
            this.config.showEdgeMovement = e.target.checked;
        });

        document.getElementById("pheromoneUpdate").addEventListener('input', (e) => {
            this.config.showPheromoneUpdate = e.target.checked;
        });

        document.getElementById("presetSelector").addEventListener('change', (e) => {
            this.config.gameState = 'setup';
            this.config.preset = e.target.value;
            this.init();
        });
    }


    init() {
        this.initSimulation();
        this.initGrid();
        if(this.config.preset !== 'random'){
            this.restoreCities();
        } else {
            this.randomizeCities();
        }
        this.randomizeRoutes();
        this.initPheromoneMatrix();
        this.initAnts();

        this.grid.redraw();
    }

    initSimulation(){
        this.grid = new Grid(this.canvas.height / this.config.cellSize, this.canvas.width / this.config.cellSize, this.context, this.config);
        this.ants = [];
        this.cities = Array.from({length: this.config.numCities});
        this.graph = Array.from({length: this.config.numCities}).map(() => new Array(this.config.numCities));   //contains pheromones as well
    }

    restoreCities(){
        let cityPreset = cityPresets[this.config.preset];
        for (let a = 0; a < cityPreset.length; a++) {
            this.cities[a] = new City(cityPreset[a].x, cityPreset[a].y, this.config.cellSize);
            this.grid.addCell(this.cities[a]);
        }
    }

    async runSimulation() {
        let bestTour = null;
        let bestTourLength = Infinity;

        let maxIterations = this.config.maxIterations;
        for (let iteration = 0; iteration < maxIterations;) {
            if(this.config.gameState === 'paused') {
                await this.delay(1000);
                continue;
            }
            if(this.config.gameState === 'setup') {
                return;
            }
            this.updateStatus(`Iteration #${iteration+1}`)
            await this.delay(60);
            for (const ant of this.ants) {
                for (let i = 0; i < this.cities.length - 1; i++) {
                    let nextCity = this.calculateNextCity(ant);
                    if (nextCity != null) {
                        let edge = this.graph[ant.currentCity][nextCity];
                        await ant.move(nextCity, edge);
                    }
                }

                let startCity = ant.path[0];
                let edge = this.graph[ant.currentCity][startCity];
                await ant.move(startCity, edge);

                let tourLength = ant.totalTravelledDistance;
                if (tourLength < bestTourLength) {
                    bestTour = ant.path;
                    bestTourLength = tourLength;
                }
                if (this.config.showEdgeSelection) {
                    await this.delay(1000);
                }
            }

            this.updatePheromones();

            if (this.config.showPheromoneUpdate) {
                await this.delay(1000);
            }
            this.grid.redraw();
            if (this.config.showPheromoneUpdate) {
                await this.delay(2000);
            }
            this.resetAnts();
            iteration++;
        }

        this.drawTour(bestTour);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updatePheromones() {
        let evaporationRate = this.config.evaporationRate;
        let pheromoneDepositFactor = this.config.pheromoneDepositFactor;

        // Pheromone evaporation
        for (let i = 0; i < this.graph.length; i++) {
            for (let j = i + 1; j < this.graph[0].length; j++) {
                this.graph[i][j].pheromoneAmount -= evaporationRate;
            }
        }

        this.ants.forEach(ant => {
            let tourLength = ant.totalTravelledDistance;
            let pheromoneToAdd = pheromoneDepositFactor / tourLength;
            let path = ant.path;

            for (let i = 0; i < path.length - 1; i++) {
                let cityA = path[i];
                let cityB = path[i + 1];
                this.graph[cityA][cityB].pheromoneAmount = Math.max(0, this.graph[cityA][cityB].pheromoneAmount + pheromoneToAdd);
                //this.graph[cityB][cityA].pheromoneAmount += pheromoneToAdd;
            }
        });
    }

    calculateNextCity(ant) {
        let alpha = this.config.alpha;
        let beta = this.config.beta;

        let totalAttractiveness = 0;
        for (let city = 0; city < this.cities.length; city++) {
            if (!ant.hasVisited(city) && this.graph[ant.currentCity][city] !== undefined) {
                let edge = this.graph[ant.currentCity][city];
                let pheromone = edge.pheromoneAmount;
                let distance = edge.distance;
                totalAttractiveness += Math.pow(pheromone, alpha) * Math.pow(1 / distance, beta);
            }
        }

        let probabilities = [];
        for (let city = 0; city < this.cities.length; city++) {
            if (!ant.hasVisited(city) && this.graph[ant.currentCity][city] !== undefined) {
                let pheromone = this.graph[ant.currentCity][city].pheromoneAmount;
                let distance = this.graph[ant.currentCity][city].distance;
                let attractiveness = Math.pow(pheromone, alpha) * Math.pow(1 / distance, beta);
                let probability = attractiveness / totalAttractiveness;
                probabilities.push({city, probability});
            }
        }

        probabilities.sort((a, b) => b.probability - a.probability);

        // Choose the next city using a roulette wheel selection
        let random = Math.random();
        let accumulatedProbability = 0;
        for (let {city, probability} of probabilities) {
            accumulatedProbability += probability;
            if (random <= accumulatedProbability) {
                return city;
            }
        }

        // This should not be reached if the probabilities are correctly normalized,
        // but return the city with the highest probability just in case
        return null;
    }


    initPheromoneMatrix() {
        for (let i = 0; i < this.graph.length; i++) {
            for (let j = 0; j < this.graph[0].length; j++) {
                if (this.graph[i][j]) {
                    let edge = this.graph[i][j];
                    edge.edgeCells.forEach(edgeCell => {
                        let pheromone = new Pheromone(edgeCell.x, edgeCell.y, this.config.cellSize, edge, this.config);
                        this.grid.addCell(pheromone);
                    });
                }
            }
        }
    }

    initAnts() {
        for (let i = 0; i < this.numAnts; i++) {
            let randomCity = this.getRandomCity();
            let ant = new Ant(
                this.cities[randomCity].x,
                this.cities[randomCity].y,
                this.config.cellSize,
                this.grid,
                this.context,
                randomCity,
                this.cities);
            this.ants.push(ant);
            this.grid.addCell(ant);
        }
    }

    getRandomCity() {
        return Math.floor(Math.random() * this.cities.length);
    }

    initGrid() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.grid.init();
    }

    randomizeCities() {
        for (let a = 0; a < this.config.numCities; a++) {
            let x = Math.floor(Math.random() * this.grid.cols);
            let y = Math.floor(Math.random() * this.grid.rows);

            while (!this.isValidCoordinate(x, y)) {
                x = Math.floor(Math.random() * this.grid.cols);
                y = Math.floor(Math.random() * this.grid.rows);
            }

            this.cities[a] = new City(x, y, this.config.cellSize);
            this.grid.addCell(this.cities[a]);
        }
    }

    randomizeRoutes() {
        let totalEdgeDistance = 0;
        let numEdges = 0;
        for (let i = 0; i < this.cities.length; i++) {
            for (let j = i; j < this.cities.length; j++) {
                if (i === j) {
                    continue;
                }
                let connect = true //Math.random() < 0.2; we are doing complete graphs in this simulation
                let distance = 0;
                if (connect) {
                    let cityA = this.cities[i];
                    let cityB = this.cities[j];

                    distance = this.calculateDistance(cityA, cityB);
                    let edgeCells = [];
                    let x = cityA.x;
                    let y = cityA.y;

                    while (x !== cityB.x || y !== cityB.y) {
                        let dx = Math.sign(cityB.x - x);
                        let dy = Math.sign(cityB.y - y);

                        x = x + dx;
                        y = y + dy;
                        if (x !== cityB.x || y !== cityB.y) {
                            let road = new Road(x, y, this.config.cellSize);
                            edgeCells.push(road);
                            this.grid.addCell(road);
                        }
                    }


                    this.graph[i][j] = new Edge(distance, edgeCells, this.config.initialPheromoneLevels);
                    this.graph[j][i] = this.graph[i][j];
                    totalEdgeDistance += distance;
                    numEdges += 1;
                }
            }
        }
        this.config.averageDistance = totalEdgeDistance / numEdges;
    }

    createEdge(from, to) {
        let cityA = this.cities[from];
        let cityB = this.cities[to];
        let distance = this.calculateDistance(cityA, cityB);
        let edgeCells = [];
        let x = cityA.x;
        let y = cityA.y;

        while (x !== cityB.x || y !== cityB.y) {
            let dx = Math.sign(cityB.x - x);
            let dy = Math.sign(cityB.y - y);

            x = x + dx;
            y = y + dy;
            if (x !== cityB.x || y !== cityB.y) {
                let road = new Road(x, y, this.config.cellSize);
                edgeCells.push(road);
                this.grid.addCell(road);
            }
        }


        this.graph[from][to] = new Edge(cityA, cityB, distance, edgeCells);
        this.graph[to][from] = this.graph[from][to];
    }

    calculateDistance(city, city2) {
        let deltaX = Math.abs(city.x - city2.x);
        let deltaY = Math.abs(city.y - city2.y);
        let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        return distance;
    }

    isValidCoordinate(x, y) {
        return x > 0 && x < this.grid.cols && y > 0 && y < this.grid.rows;
    }

    resetAnts() {
        this.ants.forEach(ant => ant.reset(this.getRandomCity()));
    }

    updateStatus(statusString){
        document.getElementById("statusDisplay").value = statusString;
    }
}