import { viewer } from "./displayMap";
import { buildGraph, aStar } from "./aStar/aStar";
import * as Cesium from 'cesium'

const routeFinder = () => {

    const graph = buildGraph();

    const findNearestNode = (point, nodes) => {
    let nearest = null;
    let minDist = Infinity;

    nodes.forEach(node => {
        // `node` to już tablica [lat, lon], więc nie parsujemy
        const dist = Math.sqrt(
            Math.pow(node[0] - point[0], 2) + Math.pow(node[1] - point[1], 2)
        );

        if (dist < minDist) {
            minDist = dist;
            nearest = node;
        }
    });

    return nearest;
};

    const nearestStart = findNearestNode([17.0629621, 51.1128680], graph.nodes);
    const nearestGoal = findNearestNode([17.0981141, 51.1027081], graph.nodes);    
    console.log("Najbliższy węzeł do startu:", nearestStart);
    console.log("Najbliższy węzeł do celu:", nearestGoal);

    const start = nearestStart;
    const goal = nearestGoal;

    const path = aStar(start, goal, graph);
    console.log('Najkrótsza trasa:', path);

    const positions = path.map(coord => Cesium.Cartesian3.fromDegrees(coord[0], coord[1]));

    const route = viewer.entities.add({
        polyline: {
            positions: positions,
            width: 5,
            material: Cesium.Color.YELLOW,
            clampToGround: true
        }
    });
}

export default routeFinder