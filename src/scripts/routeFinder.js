import { viewer } from "./displayMap";
import { buildGraph, aStar } from "./aStar/aStar";
import * as Cesium from 'cesium'
import BuildingData from '../data/universityBuildings.json'
import startMarkerPNG from '../assets/finishMarker.png'
import endMarkerPNG from '../assets/startMarker.png'

const routeFinder = () => {

    viewer.entities.removeAll()

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

    let startNode
    let endNode
    const startChoice = document.querySelector('.startChoice').value
    const endChoice = document.querySelector('.endChoice').value

    for(let i=0; i<BuildingData.buildings.length; i++){
        //console.log(BuildingData.buildings[i][0].code)
        if(BuildingData.buildings[i][0].code === startChoice){
            //console.log('odnaleziono', BuildingData.buildings[i][0].code)
            startNode = BuildingData.buildings[i][0].node
            console.log(startNode)
        }
    }
    for(let i=0; i<BuildingData.buildings.length; i++){
        if(BuildingData.buildings[i][0].code === endChoice){
            //console.log('odnaleziono', BuildingData.buildings[i][0].code)
            endNode = BuildingData.buildings[i][0].node
            console.log(endNode)
        }
    }
    //console.log(startNode, endNode)
    const nearestStart = findNearestNode(startNode, graph.nodes);
    const nearestGoal = findNearestNode(endNode, graph.nodes);    
    //console.log("Najbliższy węzeł do startu:", nearestStart);
    //console.log("Najbliższy węzeł do celu:", nearestGoal);

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

    const startPoint = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(startNode[0], startNode[1]), 
        billboard: {
            image: startMarkerPNG,
            width: 64,
            height: 64,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        
    });
    const destination = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(endNode[0], endNode[1]), 
        billboard: {
            image: endMarkerPNG,
            width: 64,
            height: 64,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        
    });
    

}

export default routeFinder