export const cellSize = 10;
export const numAnts = 10;
export const islandSize = 5;
export const numIslands = 10;






let gameState = 'setup';
export function getGameState(){
    return gameState;
}
export function setGameState(value){
    gameState = value;
}