import { viewer } from "./displayMap";
import { buildGraph, aStar } from "./aStar/aStar";
import * as Cesium from 'cesium'

const routeFinder = () => {

    const graph = buildGraph();
    const start = [17.0629621, 51.1128680];
    const goal = [17.0981141, 51.1027081];
    const path = aStar(start, goal, graph);
    //console.log('Najkrótsza trasa:', path);

    const positions = path.map(coord => Cesium.Cartesian3.fromDegrees(coord[0], coord[1]));

    viewer.entities.add({
        polyline: {
            positions: positions,
            width: 3,
            material: Cesium.Color.CORAL,
            clampToGround: true
        }
    });
}

export default routeFinder