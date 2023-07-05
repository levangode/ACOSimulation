import {TravelingSalesmanConfig} from "./travelingSalesmanConfig.js";
import {Grid} from "./grid.js";
import {City} from "./city.js";
import {Edge} from "./edge.js";
import {Ant} from "./ant.js";
import {Road} from "./road.js";
import {Pheromone} from "./pheromone.js";


export class TravelingSalesman {

    constructor() {
        this.config = new TravelingSalesmanConfig();
        this.canvas = document.getElementById('tCanvas');
        this.context = this.canvas.getContext('2d');

        this.rows = this.canvas.height / this.config.cellSize;
        this.cols = this.canvas.width / this.config.cellSize;
        this.numAnts = this.config.numAnts;

        this.grid = new Grid(this.canvas.height / this.config.cellSize, this.canvas.width / this.config.cellSize, this.context, this.config);
        this.ants = [];
        this.cities = Array.from({length: this.config.numCities});
        this.graph = Array.from({length: this.config.numCities}).map(() => new Array(this.config.numCities));   //contains pheromones as well

        this.interval = 0;
        this.intervalTimeout = 120;

        this.setupControlPanel();
        this.initializeSimulation();

    }

    async startGame() {
        let bestTour = await this.runSimulation();
        this.drawTour(bestTour);
    }

    drawTour(tour) {
        this.grid.init();
        for (let i = 0; i < tour.length - 1; i++) {
            this.createEdge(tour[i], tour[i + 1]);
        }
        this.cities.forEach(city => this.grid.addCell(city));
    }

    setupControlPanel() {
        document.getElementById("edgeSelection").addEventListener('input', (e) => {
            let value = e.target.value;
            //document.getElementById("edgeSelection").innerHTML = value;
            this.config.showEdgeSelection = value === "on";
        });

        document.getElementById("edgeMovement").addEventListener('input', (e) => {
            let value = e.target.value;
            //document.getElementById("edgeMovement").innerHTML = value;
            this.config.showEdgeMovement = value === "on";
        });

        document.getElementById("pheromoneUpdate").addEventListener('input', (e) => {
            let value = e.target.value;
            //document.getElementById("pheromoneUpdate").innerHTML = value;
            this.config.showPheromoneUpdate = value === "on";
        });
    }

    initializeSimulation() {

        this.initGrid();
        this.randomizeCities();
        this.randomizeRoutes();
        this.initPheromoneMatrix();
        this.initAnts();

        this.grid.redraw();
    }

    async runSimulation() {
        let bestTour = null;
        let bestTourLength = Infinity;

        let maxIterations = 10;
        for (let iteration = 0; iteration < maxIterations; iteration++) {
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
        }

        return bestTour;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updatePheromones() {
        let evaporationRate = 0.001;
        let pheromoneDepositFactor = 500;

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
                this.graph[cityA][cityB].pheromoneAmount += pheromoneToAdd;
                this.graph[cityB][cityA].pheromoneAmount += pheromoneToAdd;
            }
        });
    }

    calculateNextCity(ant) {
        let alpha = 1;
        let beta = 1;

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
                        let pheromone = new Pheromone(edgeCell.x, edgeCell.y, this.config.cellSize, edge);
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
        for (let i = 0; i < this.cities.length; i++) {
            for (let j = i; j < this.cities.length; j++) {
                if (i === j) {
                    continue;
                }
                let connect = Math.random() < 0.2;
                let distance = 0;
                if (true) {
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


                    this.graph[i][j] = new Edge(cityA, cityB, distance, edgeCells);
                    this.graph[j][i] = this.graph[i][j];

                }
            }
        }
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
}