import { viewer } from "./displayMap";
import { buildGraph, aStar } from "./aStar/aStar";
import * as Cesium from 'cesium'
import BuildingData from '../data/universityBuildings.json'
import startMarkerPNG from '../assets/startMarker.png'
import endMarkerPNG from '../assets/finishMarker.png'


const routeFinder = async () => {
    viewer.entities.removeAll();

    const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
            progressBar.textContent = 'Trasa gotowa!';
        }

    const startChoice = document.querySelector('.startChoice').value;
    const endChoice = document.querySelector('.endChoice').value;

    let startNode, endNode;

    for (let building of BuildingData.buildings) {
        if (building[0].code === startChoice) {
            startNode = building[0].node;
        }
        if (building[0].code === endChoice) {
            endNode = building[0].node;
        }
    }

    if (!startNode || !endNode) {
        console.error("Nie znaleziono budynków.");
        return;
    }

    // Ładujemy dane sieci drogowej (do przesłania do workera)
    const network = await import('../layers/osm_wroclaw_roads.json');

    // Uruchamiamy workera (UPEWNIJ się że masz pathWorker.js obok)
    const worker = new Worker(new URL('./pathWorker.js', import.meta.url), { type: 'module' });

    // Wysyłamy dane do workera
    worker.postMessage({
        start: startNode,
        goal: endNode,
        network: network.default // potrzebne jeśli importujesz JSON jako ES moduł
    });

    // Reakcja na otrzymanie ścieżki z workera
    worker.onmessage = function(e) {
        const { path } = e.data;

        if (!path || path.length === 0) {
            console.warn("Brak trasy.");
            return;
        }

        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = '100%';
            progressBar.textContent = 'Trasa gotowa!';
        }

        const positions = path.map(coord => Cesium.Cartesian3.fromDegrees(coord[0], coord[1]));

        viewer.entities.add({
            polyline: {
                positions: positions,
                width: 5,
                material: Cesium.Color.YELLOW,
                clampToGround: true
            }
        });

        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(startNode[0], startNode[1]),
            billboard: {
                image: startMarkerPNG,
                width: 64,
                height: 64,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });

        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(endNode[0], endNode[1]),
            billboard: {
                image: endMarkerPNG,
                width: 64,
                height: 64,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
    };
};


export default routeFinder