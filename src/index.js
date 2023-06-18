import {Food} from "./cells/food.js";
import {Ant} from "./cells/ant.js";
import {
    cellSize,
    getGameState,
    islandSize,
    numAnts,
    numIslands, setAlpha, setAntMemorySize,
    setEvaporationRate,
    setGameState, setPheromoneFoodDepositRate
} from "./globalVars.js";
import {Grid} from "./grid.js";


let canvas = document.getElementById('myCanvas');
let context = canvas.getContext('2d');
let grid = new Grid(canvas.height / cellSize, canvas.width / cellSize, context)
let ants = Array.from({length: numAnts});
let interval;
let intervalTimeout = 120;


setupControlPanel();
setup();


function setupControlPanel(){
    document.getElementById("startGame").addEventListener('click', startGame);
    document.getElementById("stopGame").addEventListener('click', stopGame);
    document.getElementById("evaporationRate").addEventListener('input', (e) => {
        let value = e.target.value;
        document.getElementById("evaporationRateValue").innerHTML = value;
        setEvaporationRate(value);
    });

    document.getElementById("alpha").addEventListener('input', (e) => {
        let value = e.target.value;
        document.getElementById("alphaValue").innerHTML = value;
        setAlpha(value);
    });

    document.getElementById("antMemory").addEventListener('input', (e) => {
        let value = e.target.value;
        document.getElementById("antMemoryValue").innerHTML = value;
        setAntMemorySize(value);
    });

    document.getElementById("simulationSpeed").addEventListener('input', (e) => {
        let value = e.target.value;
        document.getElementById("simulationSpeedValue").innerHTML = value;
        intervalTimeout = value;
        antsMove();
    });

    document.getElementById("pheromoneFoodDepositRate").addEventListener('input', (e) => {
        let value = e.target.value;
        document.getElementById("pheromoneFoodDepositRateValue").innerHTML = value;
        setPheromoneFoodDepositRate(value);
    });
}
function setup() {
    initGrid();
    randomizeFood();
    initAnts();
    antsMove();
}

function startGame() {
    setGameState('playing');
    antsMove();
}

function stopGame() {
    setGameState('setup');
    clearInterval(interval);
}

function initGrid() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    grid.init();
    grid.draw(context);
}


function antsMove() {
    clearInterval(interval);
    interval = setInterval(() => {
        if (getGameState() === 'playing') {
            grid.evaporate();
            ants.forEach(ant => ant.moving(grid, context));
        }
    }, intervalTimeout);
}

function initAnts() {
    let x = grid.cols / 2;
    let y = grid.rows / 2;

    ants = ants.map(() => new Ant(x, y));
    ants.forEach(ant => grid.addCell(ant));

}

function isValidCoordinate(x, y) {
    return x > 0 && x < grid.cols && y > 0 && y < grid.rows;
}

function randomizeFood() {
    for (let a = 0; a < numIslands; a++) {
        let x = Math.floor(Math.random() * grid.cols);
        let y = Math.floor(Math.random() * grid.rows);
        for (let i = 0; i < islandSize; i++) {
            for (let j = 0; j < islandSize; j++) {
                if (isValidCoordinate(x + i, y + j)) {
                    grid.addCell(new Food(x + i, y + j));
                }
            }
        }
    }
}

// canvas.addEventListener('mousemove', function (e) {
//     if (e.buttons === 1 && gameState === 'setup') {
//         let cell = getCell(e);
//         grid[cell.x][cell.y] = '#FF0000';
//         context.fillStyle = '#FF0000';
//         context.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
//         context.strokeRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
//     }
// });
