export const cellSize = 5;
export const numAnts = 30;
export const islandSize = 4;
export const numIslands = 20;


let gameState = 'setup';
let evaporationRate = 0.001;
let alpha = 5;
let antMemorySize = 5;
let pheromoneFoodDepositRate = 1;

export function getPheromoneFoodDepositRate(){
    return pheromoneFoodDepositRate;
}

export function setPheromoneFoodDepositRate(value){
    pheromoneFoodDepositRate = value;
}

export function getAntMemorySize(){
    return antMemorySize;
}

export function setAntMemorySize(value){
    antMemorySize = value;
}

export function getAlpha() {
    return alpha;
}

export function setAlpha(value) {
    alpha = value;
}


export function getEvaporationRate() {
    return evaporationRate;
}

export function setEvaporationRate(value) {
    evaporationRate = value;
}

export function getGameState() {
    return gameState;
}

export function setGameState(value) {
    gameState = value;
}