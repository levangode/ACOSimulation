export const cellSize = 5;
export const numAnts = 30;
export const islandSize = 4;
export const numIslands = 20;


let gameState = 'setup';
let evaporationRate = 0.001;



export function getEvaporationRate(){
    return evaporationRate;
}

export function setEvaporationRate(value){
    evaporationRate = value;
}
export function getGameState(){
    return gameState;
}
export function setGameState(value){
    gameState = value;
}