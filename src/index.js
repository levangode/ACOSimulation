import {EmptyCell} from "./emptyCell.js";
import {Food} from "./food.js";


let canvas = document.getElementById('myCanvas');
let context = canvas.getContext('2d');
context.clearRect(0, 0, canvas.width, canvas.height);
let cellSize = 10;
let gameState = 'setup';
let cols = canvas.width / cellSize;
let rows = canvas.height / cellSize;
let grid = Array.from({length: cols}).map(() => new Array(rows));


function init() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            grid[i][j] = new EmptyCell(i, j, cellSize);
        }
    }
}

function drawGrid() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            grid[i][j].draw(context);
        }
    }
}

init();
drawGrid();
randomizeFood();

function isValidCoordinate(x, y) {
    return x > 0 && x < cols && y > 0 && y < rows;
}

function randomizeFood() {
    let islandSize = 5;
    let numIslands = 6;



    for (let a = 0; a < numIslands; a++) {
        let x = Math.floor(Math.random() * cols);
        let y = Math.floor(Math.random() * rows);
        console.log(x, y);
        for (let i = 0; i < islandSize; i++) {
            for (let j = 0; j < islandSize; j++) {
                if(isValidCoordinate(x+i, y+j)) {
                    grid[x + i][y + j] = new Food(x + i, y + j, cellSize);
                    grid[x + i][y + j].draw(context);
                }
            }
        }

    }


}


function getCell(e) {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    return {
        x: Math.floor(x / cellSize),
        y: Math.floor(y / cellSize)
    };
}


function moveBlueCells() {
    let newGrid = JSON.parse(JSON.stringify(grid));

    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid.length; y++) {
            if (grid[x][y] === '#0000FF') {
                let direction = Math.floor(Math.random() * 4);

                let newX = x;
                let newY = y;
                if (direction === 0 && x > 0) newX--;
                else if (direction === 1 && x < grid.length - 1) newX++;
                else if (direction === 2 && y > 0) newY--;
                else if (direction === 3 && y < grid.length - 1) newY++;

                if (newGrid[newX][newY] !== '#0000FF') {
                    newGrid[newX][newY] = '#0000FF';
                    newGrid[x][y] = '#FFFFFF';
                }
            }
        }
    }

    grid = newGrid;
}

function gameLoop() {
    if (gameState === 'playing') {
        moveBlueCells();
        drawGrid();
        requestAnimationFrame(gameLoop);
    }
}

function updateCanvas() {
    let canvasSize = document.getElementById('canvasSize').value;
    let numBlueCells = document.getElementById('numBlueCells').value;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    cellSize = canvasSize / grid.length;
    //grid = new Array(100).fill(0).map(() => new Array(100).fill('#FFFFFF'));

    for (let i = 0; i < numBlueCells; i++) {
        let x = Math.floor(Math.random() * grid.length);
        let y = Math.floor(Math.random() * grid.length);
        //grid[x][y] = '#0000FF';
    }

    //drawGrid();
    let ant = new Food(5, 5);
    ant.draw(context);
}

function startGame() {
    gameState = 'playing';
    gameLoop();
}

function stopGame() {
    gameState = 'setup';
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

//updateCanvas();
