import {AntColony} from "./simulations/AntColonyOptimization/antColony.js";
import {TravelingSalesman} from "./simulations/TravelingSalesmanProblem/travelingSalesman.js";

let simulation;

document.getElementById("simulationSelector").addEventListener('change', (e) => {
    simulation.pauseGame();
    switchSimulation();
});

switchSimulation();

document.getElementById("startGame").addEventListener('click', () => simulation.startGame());
document.getElementById("stopGame").addEventListener('click', () => simulation.pauseGame());





function switchSimulation() {
    let selectElement = document.getElementById("simulationSelector");
    let selectedValue = selectElement.value;
    if(selectedValue === "antColony"){
        document.getElementById("travelingSalesman").style.display = 'none';
        document.getElementById("antColony").style.display = 'flex';
        simulation = new AntColony();
    } else if(selectedValue === "travelingSalesman"){
        document.getElementById("travelingSalesman").style.display = 'flex';
        document.getElementById("antColony").style.display = 'none';
        simulation = new TravelingSalesman();
    }
}