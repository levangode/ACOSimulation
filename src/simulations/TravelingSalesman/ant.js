import {Highlight} from "./highlight.js";

export class Ant {

    constructor(x, y, cellSize, grid, context, currentCity, allCities) {
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.color = 'rgb(255,0,0)';
        this.grid = grid;
        this.context = context;

        this.currentCity = currentCity;
        this.allCities = allCities;
        this.visitedCities = Array(allCities.length).fill(false);
        this.visitedCities[this.currentCity] = true;
        this.totalTravelledDistance = 0;
        this.path = [this.currentCity];
    }


    hasVisited(city) {
        return this.visitedCities[city];
    }

    async move(cityIndex, edge) {
        this.grid.removeCell(this);

        if (this.grid.config.showEdgeSelection || this.grid.config.showEdgeMovement) {
            let highlights = [];
            for (const edgeCell of edge.edgeCells) {
                highlights.push(new Highlight(edgeCell.x, edgeCell.y, edgeCell.cellSize));
            }

            highlights.forEach(highlight => this.grid.addCell(highlight));
            setTimeout(() => highlights.forEach(highlight => this.grid.removeCell(highlight)), 500);
        }

        this.x = this.allCities[cityIndex].x;
        this.y = this.allCities[cityIndex].y;

        this.grid.addCell(this);
        this.currentCity = cityIndex;
        this.visitedCities[this.currentCity] = true;
        this.path.push(this.currentCity);
        this.totalTravelledDistance += edge.distance;

        if (this.grid.config.showEdgeMovement) {
            await this.delay(1000);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    reset(city) {
        this.currentCity = city;
        this.visitedCities.fill(false);
        this.visitedCities[this.currentCity] = true;
        this.totalTravelledDistance = 0;
        this.path = [this.currentCity];
    }

    draw() {
        this.context.beginPath();
        this.context.arc(this.x * this.cellSize + this.cellSize / 2, this.y * this.cellSize + this.cellSize / 2, 5, 0, 2 * Math.PI);
        this.context.fillStyle = this.color;
        this.context.fill();
        this.context.closePath();
    }
}