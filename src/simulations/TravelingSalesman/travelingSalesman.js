import {TravelingSalesmanConfig} from "./travelingSalesmanConfig.js";
import {Grid} from "./grid.js";
import {City} from "./cells/city.js";
import {Edge} from "./edge.js";
import {EmptyCell} from "./cells/emptyCell.js";
import {Ant} from "./cells/ant.js";
import {Road} from "./cells/road.js";
import {Pheromone} from "./cells/pheromone.js";


export class TravelingSalesman {

    constructor() {
        this.config = new TravelingSalesmanConfig();
        this.canvas = document.getElementById('tCanvas');
        this.context = this.canvas.getContext('2d');

        this.rows = this.canvas.height / this.config.cellSize;
        this.cols = this.canvas.width / this.config.cellSize;
        this.numAnts = this.config.numAnts;

        this.grid = new Grid(this.canvas.height / this.config.cellSize, this.canvas.width / this.config.cellSize, this.context, this.config);
        this.ants = Array.from({length: this.config.numAnts});
        this.cities = Array.from({length: this.config.numCities});
        this.graph = Array.from({length: this.config.numCities}).map(() => new Array(this.config.numCities));   //contains pheromones as well

        this.interval = 0;
        this.intervalTimeout = 120;

        this.setupControlPanel();
        this.setup();
    }

    setupControlPanel() {

    }

    setup() {

        this.initGrid();
        this.randomizeCities();
        this.randomizeRoutes();
        this.initPheromoneMatrix();
        this.initAnts();

        this.grid.redraw();
    }

    initPheromoneMatrix(){
        for (let i = 0; i < this.graph.length; i++) {
            for (let j = 0; j < this.graph[0].length; j++){
                if(this.graph[i][j]){
                    let edge = this.graph[i][j];
                    edge.edgeCells.forEach(edgeCell => {
                        let pheromone = new Pheromone(edgeCell.x, edgeCell.y, this.config.cellSize, edge.pheromoneLevel);
                        this.grid.addCell(pheromone);
                    });
                }
            }
        }
    }

    initAnts() {
        for (let i = 0; i < this.numAnts; i++) {
            let random = Math.floor(Math.random() * this.cities.length);
            let ant = new Ant(this.cities[random].x, this.cities[random].y, this.config.cellSize);
            this.ants.push(ant);
            this.grid.addCell(ant);
        }
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
                        if(x !== cityB.x || y !== cityB.y) {
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

    calculateDistance(city, city2) {
        let deltaX = Math.abs(city.x - city2.x);
        let deltaY = Math.abs(city.y - city2.y);
        let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        return distance;
    }

    isValidCoordinate(x, y) {
        return x > 0 && x < this.grid.cols && y > 0 && y < this.grid.rows;
    }
}