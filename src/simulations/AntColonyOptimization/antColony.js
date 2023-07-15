import {Grid} from "./grid.js";
import {Ant} from "./ant.js";
import {Food} from "./food.js";
import {AntColonyConfig} from "./antColonyConfig.js";


export class AntColony {

    constructor() {
        this.config = new AntColonyConfig();


        this.canvas = document.getElementById('myCanvas');
        this.context = this.canvas.getContext('2d');

        this.grid = new Grid(this.canvas.height / this.config.cellSize, this.canvas.width / this.config.cellSize, this.context, this.config);
        this.ants = Array.from({length: this.config.numAnts});
        this.interval = 0;
        this.intervalTimeout = 120;


        this.setupControlPanel();
        this.initializeSimulation();
    }


    setupControlPanel() {

        document.getElementById("evaporationRate").addEventListener('input', (e) => {
            let value = e.target.value;
            document.getElementById("evaporationRateValue").innerHTML = value;
            this.config.evaporationRate = value;
        });

        document.getElementById("alpha").addEventListener('input', (e) => {
            let value = e.target.value;
            document.getElementById("alphaValue").innerHTML = value;
            this.config.alpha = value;
        });

        document.getElementById("antMemory").addEventListener('input', (e) => {
            let value = e.target.value;
            document.getElementById("antMemoryValue").innerHTML = value;
            this.config.antMemorySize = value;
        });

        document.getElementById("simulationSpeed").addEventListener('input', (e) => {
            let value = e.target.value;
            document.getElementById("simulationSpeedValue").innerHTML = value;
            this.intervalTimeout = value;
            this.antsMove();
        });

        document.getElementById("pheromoneFoodDepositRate").addEventListener('input', (e) => {
            let value = e.target.value;
            document.getElementById("pheromoneFoodDepositRateValue").innerHTML = value;
            this.config.pheromoneFoodDepositRate = value;
        });
    }

    initializeSimulation() {
        this.initGrid();
        this.randomizeFood();
        this.initAnts();
    }

    startGame() {
        if (this.config.gameState !== 'playing') {
            this.config.gameState = 'playing';
            this.antsMove();
        }
    }

    pauseGame() {
        if (this.config.gameState !== 'paused') {
            this.config.gameState = 'paused';
            clearInterval(this.interval);
        }
    }

    initGrid() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.grid.init();
        this.grid.draw(this.context);
    }


    antsMove() {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            if (this.config.gameState === 'playing') {
                this.grid.evaporate();
                this.ants.forEach(ant => ant.moving(this.grid, this.context));
            }
        }, this.intervalTimeout);
    }

    initAnts() {
        let x = this.grid.cols / 2;
        let y = this.grid.rows / 2;

        this.ants = this.ants.map(() => new Ant(x, y, this.config.cellSize, this.config, this.context));
        this.ants.forEach(ant => this.grid.addCell(ant));

    }

    isValidCoordinate(x, y) {
        return x > 0 && x < this.grid.cols && y > 0 && y < this.grid.rows;
    }

    randomizeFood() {
        for (let a = 0; a < this.config.numIslands; a++) {
            let x = Math.floor(Math.random() * this.grid.cols);
            let y = Math.floor(Math.random() * this.grid.rows);
            for (let i = 0; i < this.config.islandSize; i++) {
                for (let j = 0; j < this.config.islandSize; j++) {
                    if (this.isValidCoordinate(x + i, y + j)) {
                        this.grid.addCell(new Food(x + i, y + j, this.config.cellSize, this.context));
                    }
                }
            }
        }
    }
}

