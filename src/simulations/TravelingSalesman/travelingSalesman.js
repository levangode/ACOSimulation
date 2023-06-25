import {TravelingSalesmanConfig} from "./travelingSalesmanConfig.js";
import {Grid} from "./grid.js";
import {City} from "./cells/city.js";
import {Edge} from "./edge.js";


export class TravelingSalesman {

    constructor() {
        this.config = new TravelingSalesmanConfig();

        this.canvas = document.getElementById('tCanvas');
        this.context = this.canvas.getContext('2d');

        this.grid = new Grid(this.canvas.height / this.config.cellSize, this.canvas.width / this.config.cellSize, this.context, this.config);
        //this.ants = Array.from({length: this.config.numAnts});
        this.cities = Array.from({length: this.config.numCities});
        this.graph = Array.from({length: this.config.numCities}).map(() => new Array(this.config.numCities));

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
        this.cities.forEach(city => city.draw(this.context));
        this.initAnts();
    }

    initAnts() {

    }

    initGrid() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.grid.init();
        this.grid.draw(this.context);
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
            this.grid.addCell(new City(x, y, this.config.cellSize));
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
                    distance = this.calculateDistance(this.cities[i], this.cities[j]);
                    this.graph[i][j] = new Edge(this.cities[i], this.cities[j], distance, this.config.cellSize);
                    this.graph[j][i] = new Edge(this.cities[j], this.cities[i], distance, this.config.cellSize);
                    this.graph[i][j].draw(this.context);
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