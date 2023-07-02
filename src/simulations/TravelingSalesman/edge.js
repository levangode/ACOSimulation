export class Edge {

    constructor(from, to, distance, edgeCells, cellSize) {
        this.from = from;
        this.to = to;
        this.distance = distance;
        this.edgeCells = edgeCells;
        this.pheromoneAmount = 0.01;
    }
}